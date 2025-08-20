import React from "react";
import "./statementList.css"; // Import the CSS file

type Statement = {
	statement_id: string;
	title: string;
};

type StatementListProps = {
	statements?: Statement[];
	onItemClick?: (id: string) => void
};

function StatementList({ statements, onItemClick }: StatementListProps) {
	return (
		<div className="statement-list-container">
			<ul className="statement-list">
				{statements?.map((statement) => (
					<li key={statement.statement_id}
						className="statement-item"
						onClick={() => onItemClick?.(statement.statement_id)}
					>
						{statement.title}
					</li>
				))}
			</ul>
		</div>
	);
}

export default StatementList;

