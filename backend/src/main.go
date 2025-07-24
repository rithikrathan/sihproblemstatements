package main

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"strconv"
)

type Problem struct {
	ID        int    `json:"id"`
	Category  string `json:"category"`
	Number    int    `json:"number"`
	Statement string `json:"statement"`
}

type Tag struct {
	ProblemID int    `json:"problem_id"`
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
		category := c.Query("category")
		statementID := c.Query("number")
		rows, err := db.Query("SELECT * FROM test01 WHERE Statement_id = ?", statementID)
		de	:q:q:q:q:	:q	
		if err != nil{
			panic(err)
		}
		for _, p := range problems {
			if p.Category == category && p.Number == num {
				c.JSON(200, gin.H{"id": p.ID, "statement": p.Statement})
				return
			}
		}
		c.JSON(404, gin.H{"error": "Problem not found"})
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
