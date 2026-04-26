import argparse
import base64
import json
import sys
from pathlib import Path
from urllib import error, request

from PIL import Image


ROOT = Path(__file__).resolve().parent
ENV_PATH = ROOT / ".env.local"
OUTPUT_DIR = ROOT / "assets" / "endings"
API_URL = "https://api.openai.com/v1/images/generations"


PROMPTS = {
    "policy-dust-cleaner": {
        "title": "政策除塵師",
        "filename": "policy-dust-cleaner.png",
        "svg_fallback": "policy-dust-cleaner.svg",
        "prompt": """Generate one square illustration.

GLOBAL STYLE:
clean, minimal, modern 3D illustration; soft daylight lighting; gentle shadows; premium product-render style; smooth matte material; no texture noise; no painterly brush; no realism grit.

STRICT RULES:
No text. No icons. No symbols. No clutter. No props. The object itself is the character. No humanoid figure. No head, arms, or legs. No mascot or toy feeling.

COMPOSITION:
Centered subject, large whitespace, calm layout, off-white background, subtle floor plane with very light red and blue thin stripes.

SUBJECT:
A flowing golden measuring tape forming looping and wrapping curves in space. Abstract object-based form only. Slightly asymmetrical. Feel of order, analysis, structure, and flow.""",
    },
    "digital-human-rights-shield": {
        "title": "數位人權盾",
        "filename": "digital-human-rights-shield.png",
        "svg_fallback": "digital-human-rights-shield.svg",
        "prompt": """Generate one square illustration.

GLOBAL STYLE:
clean, minimal, modern 3D illustration; soft daylight lighting; gentle shadows; premium product-render style; smooth matte material; no texture noise; no painterly brush; no realism grit.

STRICT RULES:
No text. No icons. No symbols. No clutter. No props. The object itself is the character. No humanoid figure.

COMPOSITION:
Centered subject, large whitespace, calm layout, off-white background, subtle floor plane with very light red and blue thin stripes.

SUBJECT:
Interconnected black and silver chains forming a loose boundary-like loop system. Abstract, slightly asymmetrical, self-supported form. Feel of protection, boundary, constraint, and network.""",
    },
    "public-private-collaborator": {
        "title": "公私協力員",
        "filename": "public-private-collaborator.png",
        "svg_fallback": "public-private-collaborator.svg",
        "prompt": """Generate one square illustration.

GLOBAL STYLE:
clean, minimal, modern 3D illustration; soft daylight lighting; gentle shadows; premium product-render style; smooth matte material; no texture noise; no painterly brush; no realism grit.

STRICT RULES:
No text. No icons. No symbols. No clutter. No props. The object itself is the character. No humanoid figure.

COMPOSITION:
Centered subject, large whitespace, calm layout, off-white background, subtle floor plane with very light red and blue thin stripes.

SUBJECT:
Soft velcro straps interwoven and attached in a flexible layered structure. Abstract, flowing, slightly asymmetrical, with a sense of connection, translation, and collaboration.""",
    },
    "system-repairer": {
        "title": "體制修補手",
        "filename": "system-repairer.png",
        "svg_fallback": "system-repairer.svg",
        "prompt": """Generate one square illustration.

GLOBAL STYLE:
clean, minimal, modern 3D illustration; soft daylight lighting; gentle shadows; premium product-render style; smooth matte material; soft polished edges; no texture noise; no painterly brush; no realism grit.

STRICT RULES:
No text. No icons. No symbols. No clutter. No props. The object itself is the character. No humanoid figure.

COMPOSITION:
Centered subject, large whitespace, calm layout. Off-white room-like background with two tall pale blue window panels behind the subject, soft white cloud shapes, diagonal window light on the right panel, and subtle floor plane with thin pale red and blue stripes.

SUBJECT:
Thin but clearly visible woven cords forming a partial repair mesh with open loops and gentle crossings. Use warm ivory, pale beige, and soft gray strands with clear contrast from the background. Keep the structure elegant and airy, but more visible than thread. Abstract object form only. Gentle asymmetry. Match the same visual system as a premium civic-tech product render.""",
    },
    "issue-amplifier": {
        "title": "議題擴音器",
        "filename": "issue-amplifier.png",
        "svg_fallback": "issue-amplifier.svg",
        "prompt": """Generate one square illustration.

GLOBAL STYLE:
clean, minimal, modern 3D illustration; soft daylight lighting; gentle shadows; premium product-render style; smooth matte material; soft polished edges; no texture noise; no painterly brush; no realism grit.

STRICT RULES:
No text. No icons. No symbols. No clutter. No props. The object itself is the character. No humanoid figure.

COMPOSITION:
Centered subject, large whitespace, calm layout. Off-white room-like background with two tall pale blue window panels behind the subject, soft white cloud shapes, diagonal window light on the right panel, and subtle floor plane with thin pale red and blue stripes.

SUBJECT:
Bright red warning tape stretched, bent, looped, and tensioned across space in one elegant object form. Slightly asymmetrical, calm but taut, with soft premium material and a clean product-render finish. Feel of tension, exposure, and alert.""",
    },
    "edge-watcher": {
        "title": "邊緣守望犬",
        "filename": "edge-watcher.png",
        "svg_fallback": "edge-watcher.svg",
        "prompt": """Generate one square illustration.

GLOBAL STYLE:
clean, minimal, modern 3D illustration; soft daylight lighting; gentle shadows; premium product-render style; smooth matte material; soft polished edges; no texture noise; no painterly brush; no realism grit.

STRICT RULES:
No text. No icons. No symbols. No clutter. No props. The object itself is the character. No humanoid figure.

COMPOSITION:
Centered subject, large whitespace, calm layout. Off-white room-like background with two tall pale blue window panels behind the subject, soft white cloud shapes, diagonal window light on the right panel, and subtle floor plane with thin pale red and blue stripes.

SUBJECT:
Barbed rope forming a controlled, sparse perimeter-like loop with careful spacing. Keep it abstract, softened, and safe rather than dangerous realism. Use dark graphite rope with muted metal barbs, arranged in a clean premium product-render style. Slightly asymmetrical. Feel of guarding boundaries and careful distance.""",
    },
    "community-igniter": {
        "title": "社群點火員",
        "filename": "community-igniter.png",
        "svg_fallback": "community-igniter.svg",
        "prompt": """Generate one square illustration.

GLOBAL STYLE:
clean, minimal, modern 3D illustration; soft daylight lighting; gentle shadows; premium product-render style; smooth matte material; soft polished edges; no texture noise; no painterly brush; no realism grit.

STRICT RULES:
No text. No icons. No symbols. No clutter. No props. The object itself is the character. No humanoid figure.

COMPOSITION:
Centered subject, large whitespace, calm layout. Off-white room-like background with two tall pale blue window panels behind the subject, soft white cloud shapes, diagonal window light on the right panel, and subtle floor plane with thin pale red and blue stripes.

SUBJECT:
Colorful climbing ropes loosely intertwined in a dynamic but balanced flow, with rich but clean colors like blue, orange, and muted green. Abstract object form only. Slight asymmetry. Keep the exact same rendering style as the reference images: soft daylight, centered object, calm premium product-render mood. Feel of energy, gathering, and activation.""",
    },
    "mutual-aid-spirit": {
        "title": "地火互助靈",
        "filename": "mutual-aid-spirit.png",
        "svg_fallback": "mutual-aid-spirit.svg",
        "prompt": """Generate one square illustration.

GLOBAL STYLE:
clean, minimal, modern 3D illustration; soft daylight lighting; gentle shadows; premium product-render style; smooth matte material; soft polished edges; no texture noise; no painterly brush; no realism grit.

STRICT RULES:
No text. No icons. No symbols. No clutter. No props. The object itself is the character. No humanoid figure.

COMPOSITION:
Centered subject, large whitespace, calm layout. Off-white room-like background with two tall pale blue window panels behind the subject, soft white cloud shapes, diagonal window light on the right panel, and subtle floor plane with thin pale red and blue stripes.

SUBJECT:
Natural hemp rope loosely tied into soft knots and open loops, with warm beige and sand tones. Abstract object form only. Slightly asymmetrical. Keep the same centered, premium 3D product-render style as the reference images. Feel of warmth, trust, and support.""",
    },
}


def load_api_key() -> str:
    if not ENV_PATH.exists():
        raise RuntimeError(f"Missing env file: {ENV_PATH}")

    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        if key.strip() == "OPENAI_API_KEY":
            value = value.strip().strip('"').strip("'")
            if value:
                return value
    raise RuntimeError("OPENAI_API_KEY is empty in .env.local")


def generate_image(api_key: str, prompt: str, quality: str, size: str) -> bytes:
    payload = {
        "model": "gpt-image-1",
        "prompt": prompt,
        "size": size,
        "quality": quality,
        "background": "opaque",
        "output_format": "png",
    }
    req = request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
      with request.urlopen(req, timeout=300) as resp:
          data = json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as exc:
      body = exc.read().decode("utf-8", errors="replace")
      raise RuntimeError(f"OpenAI API error {exc.code}: {body}") from exc
    except error.URLError as exc:
      raise RuntimeError(f"Network error: {exc}") from exc

    image_base64 = data.get("data", [{}])[0].get("b64_json")
    if not image_base64:
        raise RuntimeError(f"No image returned from API: {data}")
    return base64.b64decode(image_base64)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate ending images into assets/endings.")
    parser.add_argument(
        "--only",
        choices=sorted(PROMPTS.keys()),
        help="Generate only one ending image.",
    )
    parser.add_argument(
        "--quality",
        default="high",
        choices=["low", "medium", "high", "auto"],
        help="Image quality for the OpenAI image API.",
    )
    parser.add_argument(
        "--size",
        default="1024x1024",
        choices=["1024x1024", "1536x1024", "1024x1536", "auto"],
        help="Requested image size.",
    )
    parser.add_argument(
        "--keep-png",
        action="store_true",
        help="Keep the intermediate PNG after converting to WEBP.",
    )
    return parser.parse_args()


def convert_png_to_webp(png_path: Path) -> Path:
    webp_path = png_path.with_suffix(".webp")
    with Image.open(png_path) as image:
        image.save(webp_path, format="WEBP", quality=92, method=6)
    return webp_path


def main() -> int:
    args = parse_args()
    api_key = load_api_key()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    items = (
        {args.only: PROMPTS[args.only]}
        if args.only
        else PROMPTS
    )

    for key, item in items.items():
        print(f"Generating {item['title']} -> {item['filename']}")
        image_bytes = generate_image(api_key, item["prompt"], args.quality, args.size)
        png_path = OUTPUT_DIR / item["filename"]
        png_path.write_bytes(image_bytes)
        print(f"Saved PNG: {png_path}")

        webp_path = convert_png_to_webp(png_path)
        print(f"Saved WEBP: {webp_path}")

        if not args.keep_png and png_path.exists():
            png_path.unlink()
            print(f"Removed PNG: {png_path}")

        svg_path = OUTPUT_DIR / item["svg_fallback"]
        if svg_path.exists():
            svg_path.unlink()
            print(f"Removed SVG: {svg_path}")

    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
