import json
import os

def generate_finetune_dataset(input_file='Cual es la diferencia entre IA.txt', output_file='finetune_data.jsonl'):
    """
    Convierte el archivo .txt en formato JSONL para Fine-tuning.
    """
    if not os.path.exists(input_file):
        print(f"❌ Error: No se encontró '{input_file}'")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = [b.strip() for b in content.split('---') if b.strip()]
    dataset = []

    for block in blocks:
        lines = block.split('\n')
        pregunta = ""
        respuesta = ""
        
        for line in lines:
            line = line.strip()
            if line.upper().startswith('P:'):
                pregunta = line.split(':', 1)[1].strip()
            elif line.upper().startswith('R:'):
                respuesta = line.split(':', 1)[1].strip()
        
        if pregunta and respuesta:
            # Formato ChatML (estándar para Llama 3 / GPT)
            example = {
                "messages": [
                    {"role": "system", "content": "Eres un asistente experto en Inteligencia Artificial."},
                    {"role": "user", "content": pregunta},
                    {"role": "assistant", "content": respuesta}
                ]
            }
            dataset.append(example)

    with open(output_file, 'w', encoding='utf-8') as f:
        for entry in dataset:
            f.write(json.dumps(entry, ensure_ascii=False) + '\n')

    print(f"✅ ¡Dataset listo! Se generaron {len(dataset)} ejemplos en '{output_file}'")
    print("💡 Recuerda: Para un Fine-tuning efectivo, se recomiendan al menos 50-100 ejemplos.")

if __name__ == "__main__":
    generate_finetune_dataset()
