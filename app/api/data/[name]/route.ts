import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'lib', 'data')

function getFile(name: string): string {
  const clean = name.replace(/\.\.\//g, '').replace(/\.json$/, '')
  return path.join(DATA_DIR, `${clean}.json`)
}

function readJson(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  try {
    const filePath = getFile(name)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const data = readJson(filePath)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to read' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  try {
    const filePath = getFile(name)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const records: any[] = readJson(filePath)
    const body = await req.json()
    const maxId = records.reduce((max, r) => Math.max(max, r.id || 0), 0)
    const record = { id: maxId + 1, ...body }
    records.push(record)
    writeJson(filePath, records)
    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  try {
    const filePath = getFile(name)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const records: any[] = readJson(filePath)
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    const idx = records.findIndex(r => r.id === id)
    if (idx === -1) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }
    records[idx] = { ...records[idx], ...rest, id }
    writeJson(filePath, records)
    return NextResponse.json(records[idx])
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const url = new URL(req.url)
  const id = parseInt(url.searchParams.get('id') || '', 10)
  if (!id) {
    return NextResponse.json({ error: 'id query param is required' }, { status: 400 })
  }
  try {
    const filePath = getFile(name)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    let records: any[] = readJson(filePath)
    const idx = records.findIndex(r => r.id === id)
    if (idx === -1) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }
    records.splice(idx, 1)
    writeJson(filePath, records)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
