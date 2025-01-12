package controllers

import (
	"fmt"       // Tambahkan fmt untuk log
    "strconv" 
	"crud-ukom/config"
	"crud-ukom/models"
	"net/http"
	
	"github.com/gin-gonic/gin"
)

// Get all packets
func GetPackets(c *gin.Context) {
    var packets []models.Packet

    // Ambil parameter user_id dari query string
    userID := c.DefaultQuery("user_id", "")
    fmt.Println("Received user_id:", userID) // Log user_id yang diterima

    if userID != "" {
        // Konversi user_id ke integer (pastikan sesuai dengan tipe data di database)
        userIDInt, err := strconv.Atoi(userID)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id"})
            return
        }

        // Jika ada user_id, kita akan filter berdasarkan apakah sudah ada order untuk user tersebut
        var orders []models.Order
        if err := config.DB.Where("id_user = ?", userIDInt).Find(&orders).Error; err != nil {
            fmt.Println("Error fetching orders:", err) // Log error jika query gagal
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data order"})
            return
        }

        // Log jumlah order yang ditemukan
        fmt.Println("Found orders for user_id", userIDInt, ":", len(orders))

        // Buat slice untuk menyimpan IDPacket yang sudah dipesan oleh user
        var orderedPacketIDs []int
        for _, order := range orders {
            orderedPacketIDs = append(orderedPacketIDs, int(order.IDPacket)) // Ganti PacketID dengan IDPacket
        }

        if len(orderedPacketIDs) > 0 {
            // Jika ada order, ambil paket yang belum dipesan oleh user
            if err := config.DB.Where("id NOT IN (?)", orderedPacketIDs).Order("created_at desc").Find(&packets).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data paket"})
                return
            }
        } else {
            // Jika user belum memiliki order sama sekali, kembalikan semua paket
            if err := config.DB.Order("created_at desc").Find(&packets).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data paket"})
                return
            }
        }

        // Jika semua paket sudah dipesan oleh user, kembalikan response null
        if len(packets) == 0 {
            c.JSON(http.StatusOK, nil) // Kembalikan null jika tidak ada paket yang tersedia
            return
        }
    } else {
        // Jika tidak ada user_id, kembalikan semua paket
        if err := config.DB.Order("created_at desc").Find(&packets).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data paket"})
            return
        }
    }

    // Kirim response dalam format JSON
    c.JSON(http.StatusOK, packets)
}


// Get packet by ID
func GetPacketByID(c *gin.Context) {
	var packet models.Packet
	id := c.Param("id")
	if err := config.DB.First(&packet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Packet not found!"})
		return
	}
	c.JSON(http.StatusOK, packet)
}

// Create new packet
func CreatePacket(c *gin.Context) {
	var input models.Packet
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&input)
	c.JSON(http.StatusOK, input)
}

// Update packet by ID
func UpdatePacket(c *gin.Context) {
	var packet models.Packet
	id := c.Param("id")
	if err := config.DB.First(&packet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Packet not found!"})
		return
	}

	var input models.Packet
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Model(&packet).Updates(input)
	c.JSON(http.StatusOK, packet)
}

// Delete packet by ID
func DeletePacket(c *gin.Context) {
	var packet models.Packet
	id := c.Param("id")
	if err := config.DB.First(&packet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Packet not found!"})
		return
	}
	config.DB.Delete(&packet)
	c.JSON(http.StatusOK, gin.H{"message": "Packet deleted successfully!"})
}

func GetPacketsByUser(c *gin.Context) {
	var orders []models.Order
	userID := c.Param("id") // Mendapatkan userID dari parameter URL

	// Menemukan semua order yang memiliki id_user = userID dan status = 1
	// Melakukan join ke tabel packet berdasarkan id_packet
	if err := config.DB.
		Where("id_user = ? AND status = ?", userID, 1).
		Order("orders.created_at desc").
		Joins("JOIN packets ON packets.id = orders.id_packet").
		Find(&orders).
		Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tidak ada paket ditemukan untuk pengguna ini!"})
		return
	}

	var result []struct {
		OrderID int           `json:"order_id"`
		Packet  models.Packet `json:"packet"`
	}

	// Menyiapkan slice untuk menyimpan data packet yang terkait
	// var packets []models.Packet

	// Ambil data packet terkait dari setiap order
	for _, order := range orders {
		var packet models.Packet
		// Mendapatkan packet berdasarkan id_packet dari order
		if err := config.DB.First(&packet, order.IDPacket).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Paket tidak ditemukan!"})
			return
		}
		// Menambahkan packet ke slice packets
		result = append(result, struct {
			OrderID int           `json:"order_id"`
			Packet  models.Packet `json:"packet"`
		}{
			OrderID: order.ID, // Menyimpan order_id
			Packet:  packet,   // Menyimpan data packet
		})
	}

	// Mengembalikan data paket
	c.JSON(http.StatusOK, result)
}
