<?php

namespace App\Filament\Resources\LeagueMatches\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LeagueMatchesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('scheduledAt')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('playedAt')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('status'),
                TextColumn::make('homeScore')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('awayScore')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('createdAt')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('updatedAt')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
