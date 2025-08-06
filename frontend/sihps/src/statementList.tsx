import React from "react"

function StatementList({ statements, setMode }) {
	return (
		<div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
			<ul style={{listStyle:"none"}}>
				{statements.map((statement) => (
					<li
						key={statement.statement_id}
						style={{
							cursor:"pointer",
							padding:"8px",
							borderBottom:"1px solit #ccc"
						}}
					>
					{statement.Title}
					</li>
				))}
			</ul>
		</div>
	)
}

return default StatementList
