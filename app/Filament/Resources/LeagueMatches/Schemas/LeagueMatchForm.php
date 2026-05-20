<?php

namespace App\Filament\Resources\LeagueMatches\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class LeagueMatchForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('seasonId')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('homePlayerId')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('awayPlayerId')
                    ->required()
                    ->columnSpanFull(),
                DateTimePicker::make('scheduledAt')
                    ->required(),
                DateTimePicker::make('playedAt'),
                TextInput::make('status')
                    ->required()
                    ->default('SCHEDULED'),
                TextInput::make('homeScore')
                    ->numeric(),
                TextInput::make('awayScore')
                    ->numeric(),
                DateTimePicker::make('createdAt')
                    ->required(),
                DateTimePicker::make('updatedAt')
                    ->required(),
            ]);
    }
}
