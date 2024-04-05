package main

import (
    "context"
    "fmt"
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/redis/go-redis/v9"
)
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {

        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Credentials", "true")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

var ctx = context.Background()
var rdb = redis.NewClient(&redis.Options{
    Addr:     "<id>.c14.us-east-1-2.ec2.cloud.redislabs.com:15622",
    Password: "*************", // no password set
    DB:       0,  // use default DB
})

type User struct {
    Username string `json:"username"`
    Score int `json:"score"` 
}

func getUsers(c *gin.Context){
    
    keys, err := rdb.ZRangeWithScores(ctx, "LeaderBoard", 0, -1).Result()
    if err != nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error fetching users 1", "message": err.Error()})
        return
    }
    c.IndentedJSON(http.StatusOK, keys)
    
}



func createUser(c *gin.Context) {
    var newUser User
    if err := c.BindJSON(&newUser); err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "message": err.Error()})
        return
    }

  
    exists, err := rdb.ZRank(ctx, "LeaderBoard", newUser.Username).Result()
    fmt.Printf("The value of exists is: %v\n", exists)
   

    if err != nil && err != redis.Nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error checking user existence", "message": err.Error()})
        return
    }
    if exists > 0 {
        c.IndentedJSON(http.StatusConflict, gin.H{"error": "User already exists", "username": newUser.Username})
        return
    }

   
   if err := rdb.ZAdd(ctx, "LeaderBoard", redis.Z{Score: float64(newUser.Score), Member: newUser.Username}).Err(); err != nil {
    c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error adding user", "message": err.Error()})
    return
}

    c.IndentedJSON(http.StatusCreated, gin.H{"message": "User created", "user": newUser})
}
func updateUser(c *gin.Context) {
    var newUser User
    if err := c.BindJSON(&newUser); err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "message": err.Error()})
        return
    }
    fmt.Printf("The value of username is: %v\n", newUser.Username)

    // Update the score of the user
    if err := rdb.ZAdd(ctx, "LeaderBoard", redis.Z{Score: float64(newUser.Score), Member: newUser.Username}).Err(); err != nil {
        c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error updating user", "message": err.Error()})
        return
    }

    c.IndentedJSON(http.StatusOK, gin.H{"message": "User updated", "username": newUser.Username, "score": newUser.Score})
}


func main(){

    router := gin.Default()
    router.Use(CORSMiddleware())
    router.GET("/",getUsers)
    router.GET("/users", getUsers)
    router.POST("/create-user", createUser)
    router.POST("/update-user", updateUser)
    router.PUT("/users/:username", updateUser)
    router.Run("localhost:8080")
}

//curl -X POST -H "Content-Type: application/json" -d '{"username": "newuser", "score": 100}' http://localhost:8080/create-user
