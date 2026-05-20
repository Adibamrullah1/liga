<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeagueMatch extends Model
{
    use HasFactory;

    protected $table = 'Match';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'seasonId',
        'homePlayerId',
        'awayPlayerId',
        'scheduledAt',
        'playedAt',
        'status',
        'homeScore',
        'awayScore',
    ];

    protected function casts(): array
    {
        return [
            'scheduledAt' => 'datetime',
            'playedAt' => 'datetime',
            'homeScore' => 'integer',
            'awayScore' => 'integer',
        ];
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class, 'seasonId', 'id');
    }

    public function homePlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'homePlayerId', 'id');
    }

    public function awayPlayer(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'awayPlayerId', 'id');
    }


}
