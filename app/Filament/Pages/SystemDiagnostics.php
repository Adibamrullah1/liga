<?php

namespace App\Filament\Pages;

use App\Models\Season;
use App\Models\Player;
use App\Models\LeagueMatch;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SystemDiagnostics extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-cpu-chip';

    protected static ?string $navigationLabel = 'System Monitor';

    protected static ?string $title = 'System Monitor & Diagnostics';

    protected static ?int $navigationSort = 99;

    protected string $view = 'filament.pages.system-diagnostics';

    public string $activeTab = 'info';
    public ?string $search = '';
    public ?string $levelFilter = 'ALL';

    public function getSystemInfo(): array
    {
        $dbStatus = 'Connected';
        $dbError = null;
        $dbDriver = 'Unknown';
        
        try {
            DB::connection()->getPdo();
            $dbDriver = DB::connection()->getDriverName();
        } catch (\Exception $e) {
            $dbStatus = 'Failed to connect';
            $dbError = $e->getMessage();
        }

        return [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'app_env' => config('app.env'),
            'app_debug' => config('app.debug') ? 'Enabled' : 'Disabled',
            'db_status' => $dbStatus,
            'db_driver' => $dbDriver,
            'db_error' => $dbError,
            'storage_writeable' => is_writable(storage_path()) ? 'Yes' : 'No',
            'logs_writeable' => is_writable(storage_path('logs')) ? 'Yes' : 'No',
        ];
    }

    public function getStats(): array
    {
        try {
            return [
                'seasons' => Season::count(),
                'players' => Player::count(),
                'matches' => LeagueMatch::count(),
                'live_matches' => LeagueMatch::where('status', 'LIVE')->count(),
                'scheduled_matches' => LeagueMatch::where('status', 'SCHEDULED')->count(),
                'finished_matches' => LeagueMatch::where('status', 'FINISHED')->count(),
            ];
        } catch (\Exception $e) {
            return [
                'seasons' => 'Error',
                'players' => 'Error',
                'matches' => 'Error',
                'live_matches' => 'Error',
                'scheduled_matches' => 'Error',
                'finished_matches' => 'Error',
                'error' => $e->getMessage(),
            ];
        }
    }

    public function getLogs(): array
    {
        $logPath = storage_path('logs/laravel.log');
        if (!file_exists($logPath)) {
            return [];
        }

        $file = file_get_contents($logPath);
        // Match Laravel log pattern
        $pattern = '/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/m';
        $parts = preg_split($pattern, $file, -1, PREG_SPLIT_DELIM_CAPTURE);
        
        $entries = [];
        $count = count($parts);
        
        for ($i = 1; $i < $count; $i += 2) {
            $timestamp = $parts[$i] ?? '';
            $content = $parts[$i + 1] ?? '';
            
            preg_match('/^ (\w+)\.(\w+): (.*)/s', $content, $matches);
            $env = $matches[1] ?? 'unknown';
            $level = $matches[2] ?? 'INFO';
            $fullText = $matches[3] ?? trim($content);
            
            $lines = explode("\n", $fullText);
            $message = trim($lines[0] ?? '');
            $stackTrace = count($lines) > 1 ? implode("\n", array_slice($lines, 1)) : '';
            
            $entry = [
                'timestamp' => $timestamp,
                'env' => $env,
                'level' => strtoupper($level),
                'message' => $message,
                'stack_trace' => trim($stackTrace),
            ];

            // Apply filters
            if ($this->levelFilter !== 'ALL' && $entry['level'] !== $this->levelFilter) {
                continue;
            }

            if (!empty($this->search)) {
                if (stripos($entry['message'], $this->search) === false && 
                    stripos($entry['stack_trace'], $this->search) === false) {
                    continue;
                }
            }

            $entries[] = $entry;
        }
        
        return array_slice(array_reverse($entries), 0, 100);
    }

    public function clearLogs(): void
    {
        $logPath = storage_path('logs/laravel.log');
        if (file_exists($logPath)) {
            File::put($logPath, '');
            Notification::make()
                ->title('Logs Cleared')
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('No logs found to clear')
                ->warning()
                ->send();
        }
    }

    public function clearAppCache(): void
    {
        try {
            Artisan::call('optimize:clear');
            Notification::make()
                ->title('Application Cache Cleared')
                ->body(Artisan::output())
                ->success()
                ->send();
        } catch (\Exception $e) {
            Notification::make()
                ->title('Cache Clear Failed')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function testDatabase(): void
    {
        $start = microtime(true);
        try {
            DB::select('SELECT 1');
            $time = round((microtime(true) - $start) * 1000, 2);
            Notification::make()
                ->title('Database Connection OK')
                ->body("Response time: {$time} ms")
                ->success()
                ->send();
        } catch (\Exception $e) {
            Notification::make()
                ->title('Database Connection Failed')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }
}
