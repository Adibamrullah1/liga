<?php

namespace App\Filament\Resources\LeagueMatches;

use App\Filament\Resources\LeagueMatches\Pages\CreateLeagueMatch;
use App\Filament\Resources\LeagueMatches\Pages\EditLeagueMatch;
use App\Filament\Resources\LeagueMatches\Pages\ListLeagueMatches;
use App\Filament\Resources\LeagueMatches\Schemas\LeagueMatchForm;
use App\Filament\Resources\LeagueMatches\Tables\LeagueMatchesTable;
use App\Models\LeagueMatch;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LeagueMatchResource extends Resource
{
    protected static ?string $model = LeagueMatch::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $schema): Schema
    {
        return LeagueMatchForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LeagueMatchesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLeagueMatches::route('/'),
            'create' => CreateLeagueMatch::route('/create'),
            'edit' => EditLeagueMatch::route('/{record}/edit'),
        ];
    }
}
