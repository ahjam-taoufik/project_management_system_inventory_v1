<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TruncateTables extends Command
{
    protected $signature = 'tables:truncate {tables?*} {--y|yes : Confirmer automatiquement}';
    protected $description = 'Vider des tables spécifiques';

    public function handle()
    {
        $tables = $this->argument('tables') ?: ['villes', 'clients', 'secteurs', 'commercials']; // Tables par défaut

        // Si l'option --yes est activée OU si l'utilisateur confirme (avec yes par défaut)
        if ($this->option('yes') || $this->confirm('Voulez-vous vraiment vider ces tables: ' . implode(', ', $tables) . '?', true)) {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            foreach ($tables as $table) {
                DB::table($table)->truncate();
                $this->info("Table $table vidée.");
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            $this->info('Tables vidées avec succès.');
        } else {
            $this->info('Opération annulée.');
        }
    }
}
