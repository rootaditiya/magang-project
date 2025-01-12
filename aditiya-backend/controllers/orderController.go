package controllers

import (
	"crud-ukom/config"
	"crud-ukom/models"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
)

// Create a new Order
func CreateOrder(c *gin.Context) {
	var input struct {
		IDUser    int    `json:"id_user" binding:"required"`
		IDPacket  int    `json:"id_packet" binding:"required"`
		OrderDate string `json:"order_date" binding:"required"`
	}

	// Bind JSON input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse date string to time.Time
	orderDate, err := time.Parse("2006-01-02", input.OrderDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	// Set the time to 00:00:00 to ensure no time is included
	orderDate = time.Date(orderDate.Year(), orderDate.Month(), orderDate.Day(), 0, 0, 0, 0, time.UTC)

	// Find packet by ID
	var packet models.Packet
	if err := config.DB.Where("id = ?", input.IDPacket).First(&packet).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Packet not found"})
		return
	}

	// Create a new order
	order := models.Order{
		IDUser:    input.IDUser,
		IDPacket:  input.IDPacket,
		OrderDate: orderDate,
		Amount:    packet.Price,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	config.DB.Create(&order)

	// Respond with the created order
	c.JSON(http.StatusOK, order)
}

// Get all Orders
func GetOrders(c *gin.Context) {
	var orders []models.Order
	if err := config.DB.Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// Get Order by ID
func GetOrderByID(c *gin.Context) {
	var order models.Order
	if err := config.DB.Where("id = ?", c.Param("id")).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	var packet models.Packet

	if err := config.DB.Where("id = ?", order.IDPacket).First(&packet).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Packet not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"order":  order,
		"packet": packet,
	})
}

// Update an Order by ID
func UpdateOrder(c *gin.Context) {
	var order models.Order
	if err := config.DB.Where("id = ?", c.Param("id")).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	var input struct {
		IDUser    int    `json:"id_user" binding:"required"`
		IDPacket  int    `json:"id_packet" binding:"required"`
		OrderDate string `json:"order_date" binding:"required"`
		Status    int    `json:"status" binding:"required"`
	}

	// Bind JSON input
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse date string to time.Time
	orderDate, err := time.Parse("2006-01-02", input.OrderDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	// Update order details
	order.IDUser = input.IDUser
	order.IDPacket = input.IDPacket
	order.OrderDate = orderDate
	order.Status = input.Status
	order.UpdatedAt = time.Now()
	config.DB.Save(&order)
	c.JSON(http.StatusOK, order)
}

// Delete an Order by ID
func DeleteOrder(c *gin.Context) {
	var order models.Order
	if err := config.DB.Where("id = ?", c.Param("id")).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Delete order
	config.DB.Delete(&order)
	c.JSON(http.StatusOK, gin.H{"message": "Order deleted successfully"})
}

// Get Orders by User ID
func GetOrdersByUserID(c *gin.Context) {
	// Ambil parameter user_id dari URL
	userID := c.Param("user_id")

	// Cari semua orders berdasarkan user_id dan urutkan berdasarkan created_at terbaru
	var orders []models.Order
	if err := config.DB.Where("id_user = ?", userID).
		Order("created_at DESC"). // Urutkan berdasarkan created_at terbaru
		Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	// Ambil data paket untuk setiap order
	var ordersWithPacket []gin.H
	for _, order := range orders {
		var packet models.Packet
		if err := config.DB.Where("id = ?", order.IDPacket).First(&packet).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Packet not found"})
			return
		}
		ordersWithPacket = append(ordersWithPacket, gin.H{
			"order":  order,
			"packet": packet,
		})
	}

	// Kembalikan daftar order bersama paket terkait
	c.JSON(http.StatusOK, ordersWithPacket)
}
