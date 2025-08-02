package main

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	r := gin.Default()
	db, err := sql.Open("sqlite3", "testdb")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Get a problem by category and number
	r.GET("/api/problem", func(c *gin.Context) {
		// table := c.Query("table")
		table := "sihps2024"
		query := fmt.Sprintf("SELECT * FROM %s WHERE Statement_id = ?", table)

		statementID := c.Query("id")
		rows, err := db.Query(query, statementID)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		if !rows.Next() {
			c.JSON(404, gin.H{"error": "Problem not found"})
			return
		}

		cols, err := rows.Columns()
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
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
	r.POST("/api/add-tag", func(c *gin.Context) {
		var input struct {
			StatementID string `json:"statement_id"`
			Tag         string `json:"tag"`
			Username    string `json:"username"`
		}

		if err := c.BindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		_, err := db.Exec(`INSERT INTO tags (statement_id, tag, username) VALUES (?, ?, ?)`,
			input.StatementID, input.Tag, input.Username)

		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "Tag added successfully", "uname": input.Username, "id": input.StatementID, "tag": input.Tag})
	})
	// Get all tagged problems grouped by tag
	r.GET("/api/user-tags/:username", func(c *gin.Context) {
		username := c.Param("username")
		tag := c.Query("tag") // ?tag=easy

		rows, err := db.Query(`
			SELECT s.Statement_id, s.title
			FROM sihps2024 s
			JOIN tags t ON s.Statement_id = t.statement_id
			WHERE t.username = ? AND t.tag = ?`, username, tag)

		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var results []gin.H
		for rows.Next() {
			var id, title string
			rows.Scan(&id, &title)
			results = append(results, gin.H{
				"statement_id": id,
				"title":        title,
			})
		}

		c.JSON(200, results)
	})

	r.POST("/api/delete-tag", func(c *gin.Context) {
		var input struct {
			StatementID string `json:"statement_id"`
			Tag         string `json:"tag"`
			Username    string `json:"username"`
		}

		if err := c.BindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		_, err := db.Exec(`DELETE FROM tags WHERE statement_id = ? AND username = ? AND tag = ?`,
			input.StatementID, input.Username, input.Tag)

		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"message": "Tag deleted successfully", "uname": input.Username, "id": input.StatementID, "tag": input.Tag})
	})

	r.Run(":5000")
}
