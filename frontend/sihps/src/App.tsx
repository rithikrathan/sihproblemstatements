import { useState, useEffect } from "react"
import axios from "axios"
import "./App.css"
import StatementList from "./statementList"

const App = () => {
	const [data, setData] = useState<any>("{}")
	const [statement_id, setSid] = useState("")
	const [username, setUname] = useState("")
	const [statements, setStatements] = useState([])
	const [tag, setTag] = useState("")
	const [mode, setMode] = useState("hello")


	//
	// GET /api/problem?id=xxxxx   => gets problem by id
	//
	// GET /api/usertags/kkkkk?tag=yyyyy => gets all problems of the given tag specific to a user
	//
	// POST /api/add-tag
	// Body: {
	// "statement_id": "xxxxx"
	// "tag": "yyyyy"
	// "username": "kkkkk"
	// } => adds a tag bro just read the thing no need for me to expain things
	//
	// POST /api/delete-tag
	// Body: {
	// "statement_id": "xxxxx"
	// "tag": "yyyyy"
	// "username": "kkkkk"
	// }

	// useEffect(() => {
	// 	// axios.get("/api/problem?id=SIH1678")
	// 	axios.get(`/api/problem?id=${statement_id}`)
	// 		.then((res) => {
	// 			console.log("Fetched", res.data)
	// 			setData(res.data)
	// 		})
	// 		.catch(err => console.error(err))
	// }, [statement_id])

	const toggle = () => {
		setMode(prev => (prev === "hello" ? "idiots" : "hello"))
	}

	const fetchStatement = async (id: string) => {
		if (id == "") {
			return
		}

		await axios.get(`/api/problem?id=${id}`)
			.then((res) => {
				console.log("Fetched", res.data)
				setData(res.data)
				setMode("hello")
			})
			.catch(err => console.error(err))
	}

	const getByTag = async () => {
		await axios.get(`/api/user-tags/${username}?tag=${tag}`)
			.then((res) => {
				console.log("Fetched", res.data)
				setStatements(res.data)
				setMode("idiots")
			})
			.catch(err => console.error(err))
	}

	const addTag = async () => {
		try {
			const res = await axios.post('/api/add-tag', {
				"statement_id": statement_id,
				"tag": tag,
				"username": username
			})
			console.log(res.data)
		} catch (err) {
			console.error(err)
		}
	}

	const removeTag = async () => {
		try {
			const res = await axios.post('/api/delete-tag', {
				"statement_id": statement_id,
				"tag": tag,
				"username": username
			})
			console.log(res.data)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div>
			<div className="inputs">
				<label htmlFor="username">Username: </label>
				<input type="text"
					value={username}
					id="username"
					onChange={(e) => setUname(e.target.value)}
				/>
				<br />
				<label htmlFor="sid">Statement id: </label>
				<input type="text"
					value={statement_id}
					id="sid"
					onChange={(e) => setSid(e.target.value)}
				/>
				<button onClick={() => fetchStatement(statement_id)}>ok</button>
				<br />
				<hr />
				<label htmlFor="tagSel">Tag: </label>
				<select name="tag" id="tagSel"
					onChange={(e) => setTag(e.target.value)}>
					<option value="">none</option>
					<option value="test1">test1</option>
					<option value="test2">test2</option>
					<option value="test3">test3</option>
					<option value="test4">test4</option>
				</select>
				<button onClick={addTag}>set tag</button>
				<button onClick={removeTag}>remove tag</button>
				<button onClick={getByTag}>get tagged statements</button>
				<button onClick={toggle}>{mode}</button>
				<hr />
			</div>
			<div className="outputs">
				<div style={{ display: mode === "hello" ? "block" : "none" }}>
					<h1>{data.Title} [{data.Statement_id}]</h1>
					<h2>Description:</h2>
					<p>{data.Description}</p>
					<h2>Details:</h2>
					<p>
						Category: {data.Category} <br />
						Organisation: {data.Organisation} <br />
						Technology Bucket: {data.Technology_Bucket} <br />
						Dataset file: {data.Datasetfile}
					</p>
				</div>
				<div style={{ display: mode === "idiots" ? "block" : "none" }}>
					<h2>Statements tagged {tag}:</h2>
					<StatementList
						statements={statements}
						onItemClick={(id) => {
							fetchStatement(id)
						}}
					/>
				</div>
			</div>
		</div>
	)
}
export default App

