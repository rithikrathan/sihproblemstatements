import { useState, useEffect } from "react"
import axios from "axios"

const App = () => {
	const [data, setData] = useState<any>(null)
	const [statement_id, setSid] = useState("")
	const [username, setUname] = useState("")
	const [statements, setStatements] = useState([])
	const [tag, setTag] = useState("")
	const [test, setTest] = useState()
	const [mode, setMode] = useState("hello")

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

	const fetchStatement = async () => {
		if (statement_id == "") {
			return
		}

		await axios.get(`/api/problem?id=${statement_id}`)
			.then((res) => {
				console.log("Fetched", res.data)
				setData(res.data)
			})
			.catch(err => console.error(err))
	}

	const getByTag = async () => {
		await axios.get(`/api/user-tags/${username}?tag=${tag}`)
			.then((res) => {
				console.log("Fetched", res.data)
				setStatements(res.data)
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
			setTest(res.data)
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
			setTest(res.data)
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
				<button onClick={fetchStatement}>ok</button>
				<br />
				<hr />
				<label htmlFor="tagSel">Tag: </label>
				<select name="tag" id="tagSel"
					onChange={(e) => setTag(e.target.value)}>
					<option value="">Select a tag</option>
					<option value="test1">test1</option>
					<option value="test2">test2</option>
					<option value="test3">test3</option>
					<option value="test4">test4</option>
				</select>
				<button onClick={addTag}>set tag</button>
				<button onClick={removeTag}>remove tag</button>
				<button onClick={getByTag}>get tagged statements</button>
				<button onClick={toggle}>toggle</button>
				<hr />
				<br />
			</div>

			<p>Title: {data?.Title}</p>
			<p>Id: {statement_id}, Username: {username}, tag: {tag}, mode: {mode}</p>
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<pre>{JSON.stringify(test, null, 2)}</pre>
			<pre>{JSON.stringify(statements, null, 2)}</pre>
		</div>
	)
}
export default App

