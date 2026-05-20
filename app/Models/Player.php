<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    use HasFactory;

    protected $table = 'Player';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'name',
        'username',
        'shortName',
        'avatarUrl',
        'description',
        'city',
    ];

    public function homeMatches(): HasMany
    {
        return $this->hasMany(LeagueMatch::class, 'homePlayerId', 'id');
    }

    public function awayMatches(): HasMany
    {
        return $this->hasMany(LeagueMatch::class, 'awayPlayerId', 'id');
    }
}
