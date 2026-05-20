<x-filament-panels::page>
    <div class="space-y-6">
        <x-filament::tabs>
            <x-filament::tabs.item
                :active="$activeTab === 'info'"
                wire:click="$set('activeTab', 'info')"
                icon="heroicon-m-information-circle"
            >
                System Info & Health
            </x-filament::tabs.item>

            <x-filament::tabs.item
                :active="$activeTab === 'logs'"
                wire:click="$set('activeTab', 'logs')"
                icon="heroicon-m-document-text"
            >
                Application Logs
            </x-filament::tabs.item>
        </x-filament::tabs>

        @if ($activeTab === 'info')
            <!-- System Info & Health Tab -->
            @php
                $systemInfo = $this->getSystemInfo();
                $stats = $this->getStats();
            @endphp

            <!-- Actions Row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <x-filament::card class="p-4 flex flex-col justify-between space-y-4">
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Database Test</h4>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Verify connectivity and latency to the database server.</p>
                    </div>
                    <x-filament::button wire:click="testDatabase" color="success" icon="heroicon-m-circle-stack" size="sm">
                        Test Connection
                    </x-filament::button>
                </x-filament::card>

                <x-filament::card class="p-4 flex flex-col justify-between space-y-4">
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Application Cache</h4>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Clear config, route, view and application caches.</p>
                    </div>
                    <x-filament::button wire:click="clearAppCache" color="warning" icon="heroicon-m-trash" size="sm">
                        Clear Cache
                    </x-filament::button>
                </x-filament::card>

                <x-filament::card class="p-4 flex flex-col justify-between space-y-4">
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Application Logs</h4>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Clear the laravel.log file to free up space or reset log tracking.</p>
                    </div>
                    <x-filament::button 
                        wire:click="clearLogs" 
                        wire:confirm="Are you sure you want to clear all logs? This action cannot be undone." 
                        color="danger" 
                        icon="heroicon-m-x-circle" 
                        size="sm"
                    >
                        Clear All Logs
                    </x-filament::button>
                </x-filament::card>
            </div>

            <!-- Info & Diagnostics Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- System Config Card -->
                <x-filament::section icon="heroicon-m-cog-6-tooth" header-actions-only>
                    <x-slot name="heading">
                        System Configuration
                    </x-slot>

                    <div class="divide-y divide-gray-100 dark:divide-gray-800">
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">PHP Version</span>
                            <span class="font-mono font-semibold">{{ $systemInfo['php_version'] }}</span>
                        </div>
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Laravel Version</span>
                            <span class="font-mono font-semibold">{{ $systemInfo['laravel_version'] }}</span>
                        </div>
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Environment</span>
                            <span class="font-semibold uppercase tracking-wider px-2 py-0.5 rounded text-xs {{ $systemInfo['app_env'] === 'production' ? 'bg-danger-500/10 text-danger-500' : 'bg-primary-500/10 text-primary-500' }}">
                                {{ $systemInfo['app_env'] }}
                            </span>
                        </div>
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Debug Mode</span>
                            <span class="font-semibold px-2 py-0.5 rounded text-xs {{ $systemInfo['app_debug'] === 'Enabled' ? 'bg-warning-500/10 text-warning-500' : 'bg-success-500/10 text-success-500' }}">
                                {{ $systemInfo['app_debug'] }}
                            </span>
                        </div>
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Storage Directory Writeable</span>
                            <span class="font-semibold px-2 py-0.5 rounded text-xs {{ $systemInfo['storage_writeable'] === 'Yes' ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500' }}">
                                {{ $systemInfo['storage_writeable'] }}
                            </span>
                        </div>
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Logs Directory Writeable</span>
                            <span class="font-semibold px-2 py-0.5 rounded text-xs {{ $systemInfo['logs_writeable'] === 'Yes' ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500' }}">
                                {{ $systemInfo['logs_writeable'] }}
                            </span>
                        </div>
                    </div>
                </x-filament::section>

                <!-- Database Diagnostics Card -->
                <x-filament::section icon="heroicon-m-circle-stack">
                    <x-slot name="heading">
                        Database & Health Check
                    </x-slot>

                    <div class="divide-y divide-gray-100 dark:divide-gray-800">
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Database Connection</span>
                            <span class="font-semibold px-2 py-0.5 rounded text-xs {{ $systemInfo['db_status'] === 'Connected' ? 'bg-success-500/10 text-success-500' : 'bg-danger-500/10 text-danger-500' }}">
                                {{ $systemInfo['db_status'] }}
                            </span>
                        </div>
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Database Driver</span>
                            <span class="font-mono font-semibold">{{ $systemInfo['db_driver'] }}</span>
                        </div>
                        
                        @if ($systemInfo['db_error'])
                            <div class="py-3">
                                <span class="block text-xs font-semibold text-danger-500 mb-1">Connection Error Detail</span>
                                <div class="p-3 bg-danger-500/10 border border-danger-500/20 rounded font-mono text-xs text-danger-700 dark:text-danger-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                                    {{ $systemInfo['db_error'] }}
                                </div>
                            </div>
                        @endif
                        
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Total Seasons Registered</span>
                            <span class="font-semibold">{{ $stats['seasons'] }}</span>
                        </div>
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Total Players Registered</span>
                            <span class="font-semibold">{{ $stats['players'] }}</span>
                        </div>
                        <div class="flex justify-between py-3 text-sm">
                            <span class="text-gray-500 dark:text-gray-400">Total Matches</span>
                            <span class="font-semibold">{{ $stats['matches'] }}</span>
                        </div>
                    </div>
                </x-filament::section>
            </div>

            <!-- Matches Status Breakdown -->
            <x-filament::section icon="heroicon-m-chart-bar-square">
                <x-slot name="heading">
                    Match Database Breakdown
                </x-slot>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span class="block text-xs font-semibold uppercase tracking-wider text-danger-500">Live Matches</span>
                        <span class="block mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">{{ $stats['live_matches'] }}</span>
                    </div>
                    <div class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span class="block text-xs font-semibold uppercase tracking-wider text-warning-500">Scheduled / Upcoming</span>
                        <span class="block mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">{{ $stats['scheduled_matches'] }}</span>
                    </div>
                    <div class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span class="block text-xs font-semibold uppercase tracking-wider text-success-500">Finished Matches</span>
                        <span class="block mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">{{ $stats['finished_matches'] }}</span>
                    </div>
                </div>
            </x-filament::section>
        @else
            <!-- Application Logs Tab -->
            @php
                $logs = $this->getLogs();
            @endphp

            <!-- Filters & Stats Panel -->
            <x-filament::card class="p-4">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex flex-1 flex-col md:flex-row gap-3">
                        <div class="w-full md:w-64">
                            <label for="search" class="sr-only">Search</label>
                            <input 
                                id="search"
                                type="search" 
                                wire:model.live.debounce.300ms="search" 
                                placeholder="Search logs..." 
                                class="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:text-white"
                            />
                        </div>
                        <div class="w-full md:w-48">
                            <label for="levelFilter" class="sr-only">Filter by Level</label>
                            <select 
                                id="levelFilter"
                                wire:model.live="levelFilter" 
                                class="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:text-white"
                            >
                                <option value="ALL">All Levels</option>
                                <option value="ERROR">ERROR</option>
                                <option value="WARNING">WARNING</option>
                                <option value="INFO">INFO</option>
                                <option value="DEBUG">DEBUG</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        Showing {{ count($logs) }} recent entries
                    </div>
                </div>
            </x-filament::card>

            <!-- Logs List -->
            <div class="space-y-4">
                @forelse ($logs as $index => $log)
                    <div 
                        x-data="{ open: false }" 
                        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm transition duration-200 hover:border-gray-300 dark:hover:border-gray-700"
                    >
                        <!-- Header -->
                        <div 
                            @click="open = !open" 
                            class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                        >
                            <div class="flex items-center gap-3">
                                <!-- Badge Level -->
                                @php
                                    $badgeClass = match($log['level']) {
                                        'ERROR', 'CRITICAL', 'ALERT', 'EMERGENCY' => 'bg-danger-500/10 text-danger-700 dark:text-danger-400 border border-danger-500/20',
                                        'WARNING', 'NOTICE' => 'bg-warning-500/10 text-warning-700 dark:text-warning-400 border border-warning-500/20',
                                        'INFO' => 'bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-500/20',
                                        default => 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20',
                                    };
                                @endphp
                                <span class="px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider {{ $badgeClass }}">
                                    {{ $log['level'] }}
                                </span>

                                <span class="text-xs font-mono text-gray-400 dark:text-gray-500">
                                    {{ $log['timestamp'] }}
                                </span>
                            </div>

                            <div class="flex-1 min-w-0 sm:px-4">
                                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {{ $log['message'] }}
                                </p>
                            </div>

                            <div class="flex items-center gap-2">
                                <span class="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono">
                                    {{ $log['env'] }}
                                </span>
                                <span 
                                    class="text-gray-400 transition-transform duration-200" 
                                    :class="open ? 'rotate-180' : ''"
                                >
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <!-- Stack Trace Content -->
                        <div 
                            x-show="open" 
                            x-collapse 
                            style="display: none;" 
                            class="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-4"
                        >
                            <h5 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Message</h5>
                            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all mb-4">
                                {{ $log['message'] }}
                            </p>

                            @if (!empty($log['stack_trace']))
                                <h5 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Stack Trace</h5>
                                <pre class="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap break-all max-h-[500px] shadow-inner">{{ $log['stack_trace'] }}</pre>
                            @else
                                <p class="text-xs text-gray-400 dark:text-gray-600 italic">No stack trace available for this entry.</p>
                            @endif
                        </div>
                    </div>
                @empty
                    <div class="p-12 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                        <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">No logs found</h3>
                        <p class="text-xs text-gray-400 mt-1">No log entries matched your filter criteria or the log file is empty.</p>
                    </div>
                @endforelse
            </div>
        @endif
    </div>
</x-filament-panels::page>
