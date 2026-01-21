import kaplay from "kaplay";
import "./style.css";

const k = kaplay({
    global: false,
    width: 640,
    height: 480,
    letterbox: true,
    background: [11, 14, 20],
});

// UI helper
window.showModal = (id, title, content) => {
    let modal = document.getElementById(id);
    if (!modal) {
        modal = document.createElement("div");
        modal.id = id;
        modal.className = "modal";
        document.getElementById("ui").appendChild(modal);
    }
    modal.innerHTML = `
        <button class="close-btn" onclick="this.parentElement.classList.remove('active')">&times;</button>
        <h1>${title}</h1>
        <div>${content}</div>
    `;
    setTimeout(() => modal.classList.add("active"), 10);
};

// Start UI
const ui = document.createElement("div");
ui.id = "ui";
document.body.appendChild(ui);

k.loadSprite("player", "/assets/player.png");
k.loadSprite("tiles", "/assets/tileset.png", {
    sliceX: 4,
    sliceY: 4,
});

k.scene("main", () => {
    // Tile map definition
    const map = k.addLevel([
        "aaaaaaaaaaaa",
        "a          a",
        "a  #       a",
        "a          a",
        "a      $   a",
        "a          a",
        "a   @      a",
        "aaaaaaaaaaaa",
    ], {
        tileWidth: 48,
        tileHeight: 48,
        pos: k.vec2(64, 64),
        tiles: {
            "a": () => [
                k.sprite("tiles", { frame: 0 }),
                k.scale(0.1875),
                k.area(),
                k.body({ isStatic: true }),
                k.z(0),
            ],
            " ": () => [
                k.sprite("tiles", { frame: 1 }),
                k.scale(0.1875),
                k.z(0),
            ],
            "#": () => [
                k.sprite("tiles", { frame: 14 }),
                k.scale(0.1875),
                k.area(),
                k.z(0),
                "about",
            ],
            "$": () => [
                k.sprite("tiles", { frame: 15 }),
                k.scale(0.1875),
                k.area(),
                k.z(0),
                "projects",
            ],
            "@": () => [
                k.sprite("tiles", { frame: 13 }),
                k.scale(0.1875),
                k.area(),
                k.z(0),
                "contact",
            ],
        },
    });

    // Add player
    const player = k.add([
        k.sprite("player"),
        k.pos(100, 100), // Safe spot
        k.area(),
        k.body(),
        k.scale(0.06), // ~60px
        k.z(10),
        "player",
    ]);

    // Movement
    const SPEED = 200;

    k.onKeyDown("left", () => {
        player.move(-SPEED, 0);
    });
    k.onKeyDown("right", () => {
        player.move(SPEED, 0);
    });
    k.onKeyDown("up", () => {
        player.move(0, -SPEED);
    });
    k.onKeyDown("down", () => {
        player.move(0, SPEED);
    });

    // Instructions
    k.add([
        k.text("Walk to the icons to explore!", { size: 16 }),
        k.pos(k.width() / 2, 20),
        k.anchor("center"),
        k.fixed(),
    ]);

    // Interactions
    player.onCollide("about", () => {
        if (!document.querySelector("#about-modal.active")) {
            window.showModal("about-modal", "About Me", "I am a passionate developer building amazing experiences.");
        }
    });

    player.onCollide("projects", () => {
        if (!document.querySelector("#projects-modal.active")) {
            window.showModal("projects-modal", "My Projects", "Check out my amazing projects on GitHub!");
        }
    });

    player.onCollide("contact", () => {
        if (!document.querySelector("#contact-modal.active")) {
            window.showModal("contact-modal", "Contact", "Email: hello@example.com");
        }
    });
});

k.go("main");
