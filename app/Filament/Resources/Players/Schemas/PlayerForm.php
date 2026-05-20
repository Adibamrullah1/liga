<?php

namespace App\Filament\Resources\Players\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PlayerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('name')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('username')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('shortName')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('avatarUrl')
                    ->columnSpanFull(),
                Textarea::make('description')
                    ->columnSpanFull(),
                Textarea::make('city')
                    ->columnSpanFull(),
                DateTimePicker::make('createdAt')
                    ->required(),
                DateTimePicker::make('updatedAt')
                    ->required(),
            ]);
    }
}
