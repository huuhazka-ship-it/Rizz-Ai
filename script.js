document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const fileStatus = document.getElementById('fileStatus');
    
    let uploadedFiles = [];
    
    // Event listener untuk tombol kirim
    sendBtn.addEventListener('click', sendMessage);
    
    // Event listener untuk tekan Enter di input
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Event listener untuk upload file
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            uploadedFiles = Array.from(this.files);
            fileStatus.textContent = `${uploadedFiles.length} file dipilih`;
            
            // Tampilkan notifikasi file di chat
            addMessage(`Saya telah mengupload ${uploadedFiles.length} file: ${uploadedFiles.map(f => f.name).join(', ')}`, 'user');
            
            // Simulasi AI memproses file
            setTimeout(() => {
                addMessage(`Terima kasih! Saya telah menerima ${uploadedFiles.length} file. Saya siap membantu Anda dengan konten file tersebut.`, 'ai');
            }, 1000);
        } else {
            fileStatus.textContent = 'Tidak ada file dipilih';
        }
    });
    
    // Fungsi untuk mengirim pesan
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Tambahkan pesan user ke chat
        addMessage(message, 'user');
        
        // Kosongkan input
        userInput.value = '';
        
        // Tampilkan indikator typing
        showTypingIndicator();
        
        // Simulasi delay untuk respons AI
        setTimeout(() => {
            removeTypingIndicator();
            const response = getAIResponse(message);
            addMessage(response, 'ai');
        }, 1000);
    }
    
    // Fungsi untuk menambahkan pesan ke chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textP = document.createElement('p');
        textP.textContent = text;
        
        contentDiv.appendChild(textP);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll ke bawah
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Fungsi untuk menampilkan indikator typing
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.id = 'typingIndicator';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }
        
        contentDiv.appendChild(typingIndicator);
        typingDiv.appendChild(contentDiv);
        chatMessages.appendChild(typingDiv);
        
        // Scroll ke bawah
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Fungsi untuk menghapus indikator typing
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Fungsi untuk menghasilkan respons AI
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Respons khusus untuk pertanyaan tentang pencipta
        if (lowerMessage.includes('siapa penciptamu') || 
            lowerMessage.includes('siapa yang menciptakanmu') ||
            lowerMessage.includes('siapa pembuatmu')) {
            return 'Rizky aiman firmansyah S.kom ada yang saya bisa bantu';
        }
        
        // Respons untuk pertanyaan matematika
        if (isMathQuestion(lowerMessage)) {
            return solveMathQuestion(message);
        }
        
        // Respons untuk pertanyaan umum
        return getGeneralResponse(lowerMessage);
    }
    
    // Fungsi untuk mendeteksi pertanyaan matematika
    function isMathQuestion(message) {
        const mathKeywords = [
            'berapa', 'hitung', 'tambah', 'kurang', 'kali', 'bagi', 
            'pangkat', 'akar', 'persen', 'matematika', 'matematik',
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            '+', '-', '*', '/', '^', 'sqrt', 'sin', 'cos', 'tan'
        ];
        
        return mathKeywords.some(keyword => message.includes(keyword));
    }
    
    // Fungsi untuk menyelesaikan pertanyaan matematika
    function solveMathQuestion(question) {
        try {
            // Ekstrak ekspresi matematika dari pertanyaan
            let mathExpression = extractMathExpression(question);
            
            if (!mathExpression) {
                return 'Maaf, saya tidak dapat menemukan ekspresi matematika dalam pertanyaan Anda.';
            }
            
            // Evaluasi ekspresi matematika
            let result = evaluateMathExpression(mathExpression);
            
            // Pastikan hasilnya akurat
            if (typeof result === 'number' && !isNaN(result)) {
                // Format angka desimal
                if (Number.isInteger(result)) {
                    return `Hasil dari ${mathExpression} adalah ${result}.`;
                } else {
                    return `Hasil dari ${mathExpression} adalah ${result.toFixed(2)}.`;
                }
            } else {
                return 'Maaf, saya tidak dapat menghitung ekspresi matematika tersebut.';
            }
        } catch (error) {
            console.error('Error dalam perhitungan matematika:', error);
            return 'Maaf, terjadi kesalahan dalam menghitung pertanyaan matematika Anda.';
        }
    }
    
    // Fungsi untuk mengekstrak ekspresi matematika dari pertanyaan
    function extractMathExpression(question) {
        // Hapus kata-kata non-matematika
        let expression = question.replace(/[^\d+\-*/().^√πe]/g, '');
        
        // Jika tidak ada ekspresi yang ditemukan, coba ekstrak dengan cara lain
        if (!expression) {
            // Cari pola seperti "1 + 1" atau "2 kali 3"
            const patterns = [
                /(\d+)\s*(\+|\-|\*|\/|\^)\s*(\d+)/,
                /(\d+)\s*(tambah|plus|\+)\s*(\d+)/,
                /(\d+)\s*(kurang|minus|\-)\s*(\d+)/,
                /(\d+)\s*(kali|\*)\s*(\d+)/,
                /(\d+)\s*(bagi|\/)\s*(\d+)/
            ];
            
            for (let pattern of patterns) {
                const match = question.match(pattern);
                if (match) {
                    if (match[2] === 'tambah' || match[2] === 'plus') {
                        expression = `${match[1]} + ${match[3]}`;
                    } else if (match[2] === 'kurang' || match[2] === 'minus') {
                        expression = `${match[1]} - ${match[3]}`;
                    } else if (match[2] === 'kali') {
                        expression = `${match[1]} * ${match[3]}`;
                    } else if (match[2] === 'bagi') {
                        expression = `${match[1]} / ${match[3]}`;
                    } else {
                        expression = `${match[1]} ${match[2]} ${match[3]}`;
                    }
                    break;
                }
            }
        }
        
        return expression;
    }
    
    // Fungsi untuk mengevaluasi ekspresi matematika
    function evaluateMathExpression(expression) {
        // Ganti simbol yang tidak standar
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Gunakan Function constructor untuk evaluasi yang aman
        // Hanya izinkan operasi matematika dasar
        const allowedChars = /^[0-9+\-*/().\s^√πe]+$/;
        if (!allowedChars.test(expression)) {
            throw new Error('Ekspresi matematika tidak valid');
        }
        
        // Evaluasi ekspresi
        return Function(`"use strict"; return (${expression})`)();
    }
    
    // Fungsi untuk menghasilkan respons umum
    function getGeneralResponse(message) {
        const responses = {
            halo: 'Halo! Ada yang bisa saya bantu?',
            hai: 'Hai! Senang berbicara dengan Anda.',
            apa kabar: 'Saya baik-baik saja, terima kasih! Bagaimana dengan Anda?',
            terima kasih: 'Sama-sama! Senang bisa membantu.',
            tolong: 'Tentu, apa yang bisa saya bantu?',
            nama: 'Saya Riz AI, asisten cerdas Anda.',
            bantuan: 'Saya bisa membantu dengan pertanyaan matematika, informasi umum, dan banyak lagi. Cobalah bertanya sesuatu!',
            selamat pagi: 'Selamat pagi! Semoga hari Anda menyenangkan.',
            selamat siang: 'Selamat siang! Ada yang bisa saya bantu?',
            selamat malam: 'Selamat malam! Semoga Anda beristirahat dengan baik.',
            bye: 'Sampai jumpa! Jangan ragu untuk kembali jika ada pertanyaan.'
        };
        
        for (const [key, value] of Object.entries(responses)) {
            if (message.includes(key)) {
                return value;
            }
        }
        
        // Respons default jika tidak ada yang cocok
        return 'Maaf, saya tidak sepenuhnya memahami pertanyaan Anda. Bisa Anda jelaskan lebih detail?';
    }
});