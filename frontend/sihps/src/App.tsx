import { useState, useEffect } from "react"
import axios from "axios"
import "./App.css"
import arrowUp from "./assets/arrows-up.png"
import StatementList from "./statementList"

const App = () => {
	const [data, setData] = useState<any>("{}")
	const [statement_id, setSid] = useState("")
	const [username, setUname] = useState("")
	const [statements, setStatements] = useState([])
	const [tag, setTag] = useState("")
	const [mode, setMode] = useState("hello")
	const [showScrollTop, setShowScrollTop] = useState(false)


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

	useEffect(() => {
		if (tag !== "") {
			getByTag()
		}
	}, [tag])

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 100); // Show when scrolled down
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// const toggle = () => {
	// 	setMode(prev => (prev === "hello" ? "idiots" : "hello"))
	// }

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
				// setMode("idiots")
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
			getByTag()
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
			getByTag()
			console.log(res.data)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className="app-container">
			<div className="form-section">
				{/* Row 1: Username, Statement ID, Fetch */}
				<div className="form-inline">
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUname(e.target.value)}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="sid">Statement ID:</label>
						<input
							type="text"
							id="sid"
							value={statement_id}
							onChange={(e) => setSid(e.target.value)}
						/>
					</div>

					<button onClick={() => fetchStatement(statement_id)}>Fetch</button>
				</div>

				<hr />

				{/* Row 2: Tag select and buttons */}
				<div className="form-inline">
					<div className="form-group">
						<label htmlFor="tagSel">Tag:</label>
						<select
							id="tagSel"
							value={tag}
							onChange={(e) => setTag(e.target.value)}
						>
							<option value="">None</option>
							<option value="test1">test1</option>
							<option value="test2">test2</option>
							<option value="test3">test3</option>
							<option value="test4">test4</option>
						</select>
					</div>

					<div className="button-group">
						<button onClick={addTag}>Set Tag</button>
						<button onClick={removeTag}>Remove Tag</button>
						<button onClick={getByTag}>Get Tagged</button>
						<button onClick={() => setMode(mode === "hello" ? "idiots" : "hello")}>
							Switch to {mode === "hello" ? "Tagged" : "Statement"} View
						</button>
					</div>
				</div>
			</div>

			<div className="output-section">
				{mode === "hello" && data && (
					<div className="statement-details">
						<h1>
							{data.Title} [{data.Statement_id}]
						</h1>
						<h2>Description</h2>
						<p>{data.Description}</p>

						<h2>Details</h2>
						<p>
							<strong>Category:</strong> {data.Category} <br />
							<strong>Organisation:</strong> {data.Organisation} <br />
							<strong>Technology Bucket:</strong> {data.Technology_Bucket} <br />
							<strong>Dataset File:</strong> {data.Datasetfile}
						</p>
					</div>
				)}

				{mode === "idiots" && (
					<div className="statement-list">
						<h2>Statements tagged: {tag}</h2>
						<StatementList
							statements={statements}
							onItemClick={(id) => {
								fetchStatement(id);
								setSid(id);
							}}
						/>
					</div>
				)}
			</div>
			{showScrollTop && (
				<button
					className="scroll-to-top"
					onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				>
					<img src={arrowUp} alt="^" className="uptop" />
				</button>
			)}
		</div>
	);

}

export default App

