import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: await bcrypt.hash('admin123', 12),
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.username)

  // Season
  const season = await prisma.season.upsert({
    where: { id: 'season-1' },
    update: {},
    create: {
      id: 'season-1',
      name: 'Season 1 - 2024',
      isActive: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
    },
  })
  console.log('✅ Season created:', season.name)

  // Teams
  const teamsData = [
    { name: 'FC Garuda', shortName: 'FCG', city: 'Jakarta', description: 'Tim kebanggaan ibu kota dengan permainan menyerang yang spektakuler.' },
    { name: 'Nusantara FC', shortName: 'NFC', city: 'Surabaya', description: 'Kekuatan dari Jawa Timur dengan pertahanan kokoh.' },
    { name: 'Borneo Elite', shortName: 'BEL', city: 'Balikpapan', description: 'Skuad muda berbakat dari Kalimantan.' },
    { name: 'Sulawesi United', shortName: 'SUU', city: 'Makassar', description: 'Semangat juang tinggi dari Indonesia Timur.' },
  ]

  const teams = await Promise.all(
    teamsData.map(data =>
      prisma.team.upsert({
        where: { name: data.name },
        update: {},
        create: data,
      })
    )
  )
  console.log('✅ Teams created:', teams.map(t => t.shortName).join(', '))

  // Players
  const playersData = [
    // FC Garuda
    { name: 'Rizki Pratama', username: 'rizki_efb', position: 'GK' as const, nationality: 'Indonesia', teamId: teams[0].id },
    { name: 'Andi Saputra', username: 'andi_pro', position: 'CB' as const, nationality: 'Indonesia', teamId: teams[0].id },
    { name: 'Dimas Wijaya', username: 'dimas_striker', position: 'ST' as const, nationality: 'Indonesia', teamId: teams[0].id },
    { name: 'Fajar Nugroho', username: 'fajar_mid', position: 'CAM' as const, nationality: 'Indonesia', teamId: teams[0].id },
    // Nusantara FC
    { name: 'Budi Santoso', username: 'budi_gk', position: 'GK' as const, nationality: 'Indonesia', teamId: teams[1].id },
    { name: 'Hendra Kusuma', username: 'hendra_cb', position: 'CB' as const, nationality: 'Indonesia', teamId: teams[1].id },
    { name: 'Joko Susilo', username: 'joko_fw', position: 'CF' as const, nationality: 'Indonesia', teamId: teams[1].id },
    { name: 'Wahyu Aditya', username: 'wahyu_wng', position: 'LW' as const, nationality: 'Indonesia', teamId: teams[1].id },
    // Borneo Elite
    { name: 'Reza Firmansyah', username: 'reza_keeper', position: 'GK' as const, nationality: 'Indonesia', teamId: teams[2].id },
    { name: 'Arif Rahman', username: 'arif_def', position: 'RB' as const, nationality: 'Indonesia', teamId: teams[2].id },
    { name: 'Yoga Pratama', username: 'yoga_st', position: 'ST' as const, nationality: 'Indonesia', teamId: teams[2].id },
    { name: 'Ilham Saputra', username: 'ilham_cm', position: 'CM' as const, nationality: 'Indonesia', teamId: teams[2].id },
    // Sulawesi United
    { name: 'Agus Hermawan', username: 'agus_gk', position: 'GK' as const, nationality: 'Indonesia', teamId: teams[3].id },
    { name: 'Bayu Setiawan', username: 'bayu_lb', position: 'LB' as const, nationality: 'Indonesia', teamId: teams[3].id },
    { name: 'Cahyo Wibowo', username: 'cahyo_rw', position: 'RW' as const, nationality: 'Indonesia', teamId: teams[3].id },
    { name: 'Dwi Purnomo', username: 'dwi_cdm', position: 'CDM' as const, nationality: 'Indonesia', teamId: teams[3].id },
  ]

  const players = await Promise.all(
    playersData.map(data =>
      prisma.player.upsert({
        where: { username: data.username },
        update: {},
        create: data,
      })
    )
  )
  console.log('✅ Players created:', players.length)

  // Sample Matches
  const matchesData = [
    { homeTeamId: teams[0].id, awayTeamId: teams[1].id, scheduledAt: new Date('2024-01-15T19:00:00'), status: 'FINISHED' as const, homeScore: 3, awayScore: 1, playedAt: new Date('2024-01-15T19:00:00') },
    { homeTeamId: teams[2].id, awayTeamId: teams[3].id, scheduledAt: new Date('2024-01-15T21:00:00'), status: 'FINISHED' as const, homeScore: 2, awayScore: 2, playedAt: new Date('2024-01-15T21:00:00') },
    { homeTeamId: teams[1].id, awayTeamId: teams[2].id, scheduledAt: new Date('2024-01-22T19:00:00'), status: 'FINISHED' as const, homeScore: 0, awayScore: 1, playedAt: new Date('2024-01-22T19:00:00') },
    { homeTeamId: teams[3].id, awayTeamId: teams[0].id, scheduledAt: new Date('2024-01-22T21:00:00'), status: 'FINISHED' as const, homeScore: 1, awayScore: 4, playedAt: new Date('2024-01-22T21:00:00') },
    { homeTeamId: teams[0].id, awayTeamId: teams[2].id, scheduledAt: new Date('2024-02-05T19:00:00'), status: 'FINISHED' as const, homeScore: 2, awayScore: 0, playedAt: new Date('2024-02-05T19:00:00') },
    { homeTeamId: teams[1].id, awayTeamId: teams[3].id, scheduledAt: new Date('2024-02-05T21:00:00'), status: 'FINISHED' as const, homeScore: 3, awayScore: 2, playedAt: new Date('2024-02-05T21:00:00') },
    // Upcoming
    { homeTeamId: teams[2].id, awayTeamId: teams[0].id, scheduledAt: new Date('2024-12-15T19:00:00'), status: 'SCHEDULED' as const, homeScore: null, awayScore: null, playedAt: null },
    { homeTeamId: teams[3].id, awayTeamId: teams[1].id, scheduledAt: new Date('2024-12-15T21:00:00'), status: 'SCHEDULED' as const, homeScore: null, awayScore: null, playedAt: null },
  ]

  const matches = await Promise.all(
    matchesData.map(data =>
      prisma.match.create({
        data: { ...data, seasonId: season.id },
      })
    )
  )
  console.log('✅ Matches created:', matches.length)

  // Player Stats for finished matches
  const finishedMatches = matches.filter(m => m.status === 'FINISHED')

  // Match 1: FCG 3-1 NFC
  await prisma.playerStat.createMany({
    data: [
      { matchId: finishedMatches[0].id, playerId: players[2].id, goals: 2, assists: 0, rating: 9.0, minutesPlayed: 90 },
      { matchId: finishedMatches[0].id, playerId: players[3].id, goals: 1, assists: 2, rating: 8.5, minutesPlayed: 90 },
      { matchId: finishedMatches[0].id, playerId: players[6].id, goals: 1, assists: 0, rating: 7.0, minutesPlayed: 90 },
    ],
  })

  // Match 2: BEL 2-2 SUU
  await prisma.playerStat.createMany({
    data: [
      { matchId: finishedMatches[1].id, playerId: players[10].id, goals: 2, assists: 0, rating: 8.5, minutesPlayed: 90 },
      { matchId: finishedMatches[1].id, playerId: players[14].id, goals: 1, assists: 1, rating: 8.0, minutesPlayed: 90 },
      { matchId: finishedMatches[1].id, playerId: players[15].id, goals: 1, assists: 0, rating: 7.5, minutesPlayed: 90 },
    ],
  })

  // Match 3: NFC 0-1 BEL
  await prisma.playerStat.createMany({
    data: [
      { matchId: finishedMatches[2].id, playerId: players[10].id, goals: 1, assists: 0, rating: 8.0, minutesPlayed: 90 },
      { matchId: finishedMatches[2].id, playerId: players[11].id, goals: 0, assists: 1, rating: 7.5, minutesPlayed: 90 },
    ],
  })

  // Match 4: SUU 1-4 FCG
  await prisma.playerStat.createMany({
    data: [
      { matchId: finishedMatches[3].id, playerId: players[2].id, goals: 3, assists: 0, rating: 9.5, minutesPlayed: 90 },
      { matchId: finishedMatches[3].id, playerId: players[3].id, goals: 1, assists: 2, rating: 8.5, minutesPlayed: 90 },
      { matchId: finishedMatches[3].id, playerId: players[14].id, goals: 1, assists: 0, rating: 7.0, minutesPlayed: 90 },
    ],
  })

  // Match 5: FCG 2-0 BEL
  await prisma.playerStat.createMany({
    data: [
      { matchId: finishedMatches[4].id, playerId: players[2].id, goals: 1, assists: 1, rating: 8.5, minutesPlayed: 90 },
      { matchId: finishedMatches[4].id, playerId: players[3].id, goals: 1, assists: 0, rating: 8.0, minutesPlayed: 90 },
    ],
  })

  // Match 6: NFC 3-2 SUU
  await prisma.playerStat.createMany({
    data: [
      { matchId: finishedMatches[5].id, playerId: players[6].id, goals: 2, assists: 0, rating: 8.5, minutesPlayed: 90 },
      { matchId: finishedMatches[5].id, playerId: players[7].id, goals: 1, assists: 1, rating: 8.0, minutesPlayed: 90 },
      { matchId: finishedMatches[5].id, playerId: players[14].id, goals: 1, assists: 1, rating: 7.5, minutesPlayed: 90, yellowCard: true },
      { matchId: finishedMatches[5].id, playerId: players[15].id, goals: 1, assists: 0, rating: 7.0, minutesPlayed: 90 },
    ],
  })

  console.log('✅ Player stats created')

  console.log('\n🎉 Seed selesai!')
  console.log('📌 Login admin: username=admin, password=admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
