<?php

namespace App\Filament\Resources\LeagueMatches\Pages;

use App\Filament\Resources\LeagueMatches\LeagueMatchResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLeagueMatch extends EditRecord
{
    protected static string $resource = LeagueMatchResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
