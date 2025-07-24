package main

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type Tag struct {
	ProblemID int    `json:"Statement_id"`
	Tag       string `json:"tag"`
}

func main() {
	r := gin.Default()
	db, err := sql.Open("sqlite3", "../testdb")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Get a problem by category and number
	r.GET("/api/problem", func(c *gin.Context) {
		// table := c.Query("table")
		// query := fmt.Sprintf("SELECT * FROM %s WHERE Statement_id = ?",table)
		query := fmt.Sprint("SELECT * FROM test01 WHERE Statement_id = ?")
		statementID := c.Query("id")
		rows, err := db.Query(query, statementID)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		if !rows.Next() {
			c.JSON(404, gin.H{"error": "Problem not found"})
			return
		}

		cols, err := rows.Columns()
		if err != nil {
			log.Fatal(err)
		}

		values := make([]interface{}, len(cols))
		valuesPtr := make([]interface{}, len(cols))

		for i := range values {
			valuesPtr[i] = &values[i]
		}

		rows.Scan(valuesPtr...)

		rowMap := make(map[string]interface{})

		for i, col := range cols {
			value := values[i]
			rowMap[col] = value
		}

		if rows.Next() {
			c.JSON(404, gin.H{"error": "Multiple rows found"})
			return
		}
		c.JSON(200, rowMap)
	})

	// Add a tag to a problem
	r.POST("/api/tag", func(c *gin.Context) {
		var body Tag
		if err := c.BindJSON(&body); err != nil {
			c.JSON(400, gin.H{"error": "Invalid JSON"})
			return
		}
		tags = append(tags, body)
		c.JSON(200, gin.H{"status": "tag added"})
	})

	// Get all tagged problems grouped by tag
	r.GET("/api/tags", func(c *gin.Context) {
		grouped := map[string][]gin.H{}

		for _, t := range tags {
			for _, p := range problems {
				if p.ID == t.ProblemID {
					grouped[t.Tag] = append(grouped[t.Tag], gin.H{
						"id":        p.ID,
						"category":  p.Category,
						"number":    p.Number,
						"statement": p.Statement,
					})
				}
			}
		}

		c.JSON(200, grouped)
	})

	r.Run(":5000")
}
