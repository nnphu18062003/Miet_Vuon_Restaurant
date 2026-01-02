# Database Management Guide

## 🔧 Initial Setup (First Time Only)

Khi setup project lần đầu:

```bash
# 1. Start containers
docker-compose up -d

# 2. Wait for database to be ready (about 10 seconds)

# 3. Run initial setup (migrations + seeds)
npm run db:setup
```

## 🔄 Daily Development

Khi làm việc hàng ngày, chỉ cần:

```bash
docker-compose up -d
```

Dữ liệu sẽ được giữ nguyên! ✅

## 📊 Database Commands

### Migrations
```bash
# Run new migrations
npm run db:migrate

# Rollback all migrations
npm run db:rollback
```

### Seeds
```bash
# Run seeds (CHỈ dùng khi muốn reset data)
npm run db:seed
```

### Reset Database
```bash
# ⚠️ WARNING: Xóa toàn bộ data và tạo lại từ đầu
npm run db:reset
```

## 🐳 Docker Volume Management

### View volumes
```bash
docker volume ls
```

### Backup database
```bash
docker exec restaurant_db pg_dump -U postgres restaurant_project > backup.sql
```

### Restore database
```bash
docker exec -i restaurant_db psql -U postgres restaurant_project < backup.sql
```

### Delete volume (⚠️ XÓA TOÀN BỘ DATA)
```bash
docker-compose down -v
```

## 🏢 Production Best Practices

1. **KHÔNG BAO GIỜ** chạy seeds trong production
2. Chỉ chạy migrations khi deploy version mới
3. Luôn backup database trước khi migrate
4. Sử dụng migration versioning (Knex tự động làm)
