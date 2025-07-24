package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "../testdb")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	psnumber := "SIH1531" // your value
	rows, err := db.Query("SELECT * FROM test01 WHERE Statement_id = ?", psnumber)

	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		log.Fatal(err)
	}

	var results []map[string]interface{}

	for rows.Next() {
		// make a slice of empty interfaces to hold values
		values := make([]interface{}, len(columns))
		valuePtrs := make([]interface{}, len(columns))

		for i := range values {
			valuePtrs[i] = &values[i]
		}

		rows.Scan(valuePtrs...)

		rowMap := make(map[string]interface{})
		for i, col := range columns {
			val := values[i]
			rowMap[col] = val
		}

		results = append(results, rowMap)
	}

	jsonData, err := json.MarshalIndent(results, "", "  ")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(string(jsonData))
}
