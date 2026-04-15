import os
import json
import time
from dotenv import load_dotenv
from groq import Groq

# Cargar variables de entorno (API Key) desde .env
load_dotenv()

def train_chatbot_pro(input_file='Cual es la diferencia entre IA.txt', output_file='dat.json'):
    """
    Versión PROFESIONAL del entrenamiento:
    Usa Llama 3.3 para entender el texto y generar palabras clave inteligentes.
    """
    print(f"🚀 Iniciando entrenamiento PRO con Llama-3.3...")
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ Error: No se encontró la GROQ_API_KEY en el archivo .env")
        return

    client = Groq(api_key=api_key)

    if not os.path.exists(input_file):
        print(f"❌ Error: No se encuentra el archivo {input_file}")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Separar por el delimitador ---
    bloques = [b.strip() for b in content.split("---") if b.strip()]
    knowledge_base = []

    for idx, bloque in enumerate(bloques):
        print(f"Procesando bloque {idx+1}/{len(bloques)}...")
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un experto en RAG. Extrae palabras clave (keywords) y la respuesta del texto. Devuelve SOLO un JSON: {\"keywords\": [...], \"answers\": [\"...\"]}"
                    },
                    {"role": "user", "content": bloque}
                ],
                temperature=0.1
            )

            res_text = response.choices[0].message.content.strip()
            if "```" in res_text:
                res_text = res_text.split("```")[1].replace("json", "").strip()
            
            knowledge_base.append(json.loads(res_text))
            time.sleep(0.5)

        except Exception as e:
            print(f"⚠️ Error en bloque {idx+1}: {e}")

    # Guardar resultado final
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(knowledge_base, f, indent=2, ensure_ascii=False)

    print(f"✅ ¡ÉXITO! Se ha generado '{output_file}' con {len(knowledge_base)} entradas.")

if __name__ == "__main__":
    train_chatbot_pro()

