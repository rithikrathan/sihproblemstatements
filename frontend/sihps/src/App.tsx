import { useState, useEffect } from "react"
import axios from "axios"

type Problem = {
  id: number
  category: string
  number: number
  statement: string
}

type TaggedGroup = {
  [tag: string]: Problem[]
}

function App() {
  const [category, setCategory] = useState<"hardware" | "software">("hardware")
  const [number, setNumber] = useState<string>("")
  const [statement, setStatement] = useState<string>("")
  const [problemId, setProblemId] = useState<number | null>(null)
  const [tagged, setTagged] = useState<TaggedGroup>({})
  const [error, setError] = useState<string>("")

  const getStatement = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/problem", {
        params: { category, number },
      })
      setStatement(res.data.statement)
      setProblemId(res.data.id)
      setError("")
    } catch {
      setStatement("")
      setProblemId(null)
      setError("Problem not found.")
    }
  }

  const tagProblem = async (tag: string) => {
    if (!problemId) return
    await axios.post("http://localhost:5000/api/tag", {
      problem_id: problemId,
      tag,
    })
    fetchTags()
  }

  const fetchTags = async () => {
    const res = await axios.get("http://localhost:5000/api/tags")
    setTagged(res.data)
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hackathon Problem Viewer</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value as "hardware" | "software")}>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
        </select>

        <input
          type="number"
          placeholder="Project Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        <button onClick={getStatement}>Get Statement</button>
      </div>

      {statement && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Problem Statement:</strong>
          <p>{statement}</p>
          <button onClick={() => tagProblem("selected")}>✅ Selected</button>
          <button onClick={() => tagProblem("need_to_discuss")}>💬 Need to Discuss</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <h2>Tagged Problems</h2>
      {Object.entries(tagged).map(([tag, problems]) => (
        <div key={tag}>
          <h3>{tag.toUpperCase()}</h3>
          {problems.map((p) => (
            <div key={p.id} style={{ marginBottom: "0.5rem", padding: "0.5rem", background: "#f0f0f0" }}>
              <strong>{p.category} #{p.number}</strong>
              <p>{p.statement}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default App
