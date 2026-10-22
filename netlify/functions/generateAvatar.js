exports.handler = async function(event, context) {
    // 1. Sicherheits-Türsteher: Wir lassen nur Daten-Uploads (POST) durch
    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: "Nur POST-Anfragen erlaubt!" }) 
        };
    }

    try {
        // 2. Den geheimen Schlüssel aus dem Netlify-Tresor holen
        const apiKey = process.env.GEMINI_API_KEY;
        
        // 3. Das hochgeladene Foto aus der App entpacken
        const requestData = JSON.parse(event.body);
        const imageBase64 = requestData.image; 

        // 4. Die Anfrage an die Google API schicken
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Mache aus diesem Gesicht einen coolen 3D-Comic-Avatar im Pixar-Stil." },
                        { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
                    ]
                }]
            })
        });

        const apiResult = await response.json();

        // 5. Das Ergebnis an deine Spurwechsel-App zurückschicken
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: true, data: apiResult })
        };

    } catch (error) {
        console.error("Fehler beim KI-Mittelsmann:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: "Fehler beim Server." })
        };
    }
};
