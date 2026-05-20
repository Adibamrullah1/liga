<?php

namespace App\Filament\Resources\Seasons\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SeasonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('name')
                    ->required()
                    ->columnSpanFull(),
                Toggle::make('isActive')
                    ->required(),
                DateTimePicker::make('startDate')
                    ->required(),
                DateTimePicker::make('endDate')
                    ->required(),
                DateTimePicker::make('createdAt')
                    ->required(),
                DateTimePicker::make('updatedAt')
                    ->required(),
            ]);
    }
}
