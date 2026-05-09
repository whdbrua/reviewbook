import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error in GET /api/books:", error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error("Internal error in GET /api/books:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("books")
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error("Supabase error in POST /api/books:", error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error("Internal error in POST /api/books:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
