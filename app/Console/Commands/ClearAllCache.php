<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearAllCache extends Command
{
    protected $signature = 'app:clear';
    protected $description = 'Nettoie tous les caches Laravel (config, route, vue, cache, optimize)';

    public function handle(): int
    {
        $this->info('🔄 Nettoyage de tous les caches Laravel...');

        $this->callSilent('config:clear');
        $this->callSilent('cache:clear');
        $this->callSilent('route:clear');
        $this->callSilent('view:clear');
        $this->callSilent('optimize:clear');

        // Optionnel : régénérer les caches
        $this->callSilent('config:cache');
        $this->callSilent('route:cache');

        $this->info('✅ Tous les caches ont été nettoyés et régénérés.');

        return self::SUCCESS;
    }
}
