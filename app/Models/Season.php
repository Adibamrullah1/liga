<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    use HasFactory;

    protected $table = 'Season';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $fillable = [
        'id',
        'name',
        'isActive',
        'startDate',
        'endDate',
    ];

    protected function casts(): array
    {
        return [
            'isActive' => 'boolean',
            'startDate' => 'datetime',
            'endDate' => 'datetime',
        ];
    }

    public function matches(): HasMany
    {
        return $this->hasMany(LeagueMatch::class, 'seasonId', 'id');
    }
}
