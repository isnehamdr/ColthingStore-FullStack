<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\SystemNotification;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

class NotificationService
{
    public static function notifyUser(?int $userId, string $type, string $title, string $message, array $data = []): void
    {
        if (!$userId || !Schema::hasTable('system_notifications')) {
            return;
        }

        SystemNotification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function notifyAdmins(string $type, string $title, string $message, array $data = []): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        User::query()
            ->where('role', 'admin')
            ->pluck('id')
            ->each(function (int $adminId) use ($type, $title, $message, $data) {
                self::notifyUser($adminId, $type, $title, $message, $data);
            });
    }

    public static function notifyUsers(Collection $userIds, string $type, string $title, string $message, array $data = []): void
    {
        $userIds
            ->filter()
            ->unique()
            ->each(function (int $userId) use ($type, $title, $message, $data) {
                self::notifyUser($userId, $type, $title, $message, $data);
            });
    }

    public static function logActivity(string $name, ?string $ipAddress, string $title): void
    {
        if (!Schema::hasTable('activity_logs')) {
            return;
        }

        ActivityLog::create([
            'name' => $name,
            'ip_address' => $ipAddress,
            'title' => $title,
        ]);
    }
}
