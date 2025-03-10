



document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById("mobile-menu-button")
    const mobileMenu = document.getElementById("mobile-menu")

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden")
        })
    }

    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu?.querySelectorAll("a")
    mobileMenuLinks?.forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden")
        })
    })

    // Highlight active section in navigation
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll("nav a")

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.7,
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id")
                navLinks.forEach((link) => {
                    link.classList.remove("text-cyber-purple")

                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("text-cyber-purple")
                    }
                })
            }
        })
    }, observerOptions)

    sections.forEach((section) => {
        observer.observe(section)
    })

    // Add terminal typing effect to the about section paragraph
    const aboutParagraph = document.querySelector("#about p")
    if (aboutParagraph) {
        const originalText = aboutParagraph.textContent
        aboutParagraph.textContent = ""

        let i = 0
        const typeWriter = () => {
            if (i < originalText.length) {
                aboutParagraph.textContent += originalText.charAt(i)
                i++
                setTimeout(typeWriter, Math.random() * 10 + 5)
            }
        }

        // Start typing when about section is in view
        const aboutSection = document.getElementById("about")
        const aboutObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && aboutParagraph.textContent === "") {
                        setTimeout(typeWriter, 500)
                    }
                })
            },
            { threshold: 0.3 },
        )

        if (aboutSection) {
            aboutObserver.observe(aboutSection)
        }
    }
})

ear.svg(document.querySelector("#origami-1"), (svg) => {
    // kabuto cp
    const kabuto = {
        frame_classes: ["creasePattern"],
        vertices_coords: [
            [0.5, 0],
            [0.5, 0.5],
            [1, 0.5],
            [0.25, 0.25],
            [0, 0.5],
            [0.5, 1],
            [0.75, 0.75],
            [0.14644660940672669, 0],
            [1, 0.8535533905932734],
            [0.625, 0],
            [1, 0.375],
            [0, 0],
            [1, 1],
            [0.75, 0],
            [1, 0.25],
            [0, 0.14644660940672669],
            [0.8535533905932734, 1],
            [0, 1],
            [1, 0],
        ],
        edges_vertices: [
            [0, 1],
            [1, 2],
            [3, 4],
            [0, 2],
            [5, 6],
            [5, 4],
            [3, 7],
            [6, 8],
            [9, 10],
            [1, 5],
            [4, 1],
            [0, 3],
            [11, 3],
            [3, 1],
            [6, 2],
            [1, 6],
            [6, 12],
            [13, 14],
            [3, 15],
            [6, 16],
            [5, 17],
            [17, 4],
            [13, 18],
            [18, 14],
            [11, 7],
            [7, 0],
            [2, 8],
            [8, 12],
            [4, 15],
            [15, 11],
            [0, 9],
            [9, 13],
            [14, 10],
            [10, 2],
            [12, 16],
            [16, 5],
        ],
        edges_assignment: [
            "M",
            "M",
            "M",
            "M",
            "M",
            "M",
            "M",
            "M",
            "M",
            "V",
            "V",
            "V",
            "V",
            "V",
            "V",
            "V",
            "V",
            "V",
            "V",
            "V",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
            "B",
        ],
        faces_vertices: [
            [5, 4, 1],
            [1, 0, 2],
            [4, 5, 17],
            [2, 0, 9, 10],
            [10, 9, 13, 14],
            [14, 13, 18],
            [3, 7, 0],
            [8, 6, 2],
            [0, 1, 3],
            [1, 2, 6],
            [4, 3, 1],
            [6, 5, 1],
            [3, 4, 15],
            [5, 6, 16],
            [11, 3, 15],
            [6, 12, 16],
            [7, 3, 11],
            [6, 8, 12],
        ],
    }

    svg.size(0.75, 0.4).padding(0.05).strokeWidth(0.005)

    const folded = ear.graph(kabuto).flatFolded()
    folded.faces_layer = ear.layer.solver(folded).facesLayer(1, 1)

    svg.origami(folded).translate(-0.333, 0.025).rotate(-45)
})

ear.svg(document.querySelector("#origami-2"), (svg) => {
    let callback // Declare callback variable

    svg.size(500, 500)

    const bottom = svg.g().strokeWidth(7).strokeLinecap("round")
    const middle = svg.g()
    const top = svg.g().strokeWidth(7).strokeLinecap("round")

    const grayLine1 = bottom.line().stroke("lightgray").addClass("stroke-pen-1").strokeDasharray("7 14")
    const grayLine2 = bottom.line().stroke("lightgray").addClass("stroke-pen-1").strokeDasharray("7 14")
    const grayLine3 = bottom.line().stroke("lightgray").addClass("stroke-pen-1").strokeDasharray("7 14")
    const grayDots = [
        bottom.circle().fill("lightgray").addClass("fill-pen-1").radius(16),
        bottom.circle().fill("lightgray").addClass("fill-pen-1").radius(16),
    ]
    const curve = bottom.path().stroke("gold").addClass("stroke-gold").fill("none")
    const midLine = top.line().stroke("blue").addClass("stroke-blue")
    const midPoints = [
        svg.circle().radius(16).fill("blue").addClass("fill-blue"),
        svg.circle().radius(16).fill("blue").addClass("fill-blue"),
    ]
    const lerpDot = svg.circle().radius(16).fill("gold").addClass("fill-gold")

    const angles = [Math.random() * Math.PI * 2]
    angles[1] = angles[0] + Math.random() * Math.PI * 0.7 + 1
    angles[2] = angles[1] + Math.random() * Math.PI * 0.7 + 1
    const positions = angles.map((a, i) => [
        svg.getWidth() / 2 + Math.cos(a) * svg.getHeight() * 0.4,
        svg.getHeight() / 2 + Math.sin(a) * svg.getHeight() * 0.4,
    ])

    const controls = svg
        .controls(3)
        .svg(() => middle.circle().radius(16).fill("red").addClass("fill-red"))
        .position((_, i) => positions[i])
        .onChange((point, i, points) => {
            const mids = [0, 1].map((i) => ear.vector(points[i]).lerp(points[2], 0.666))
            curve
                .clear()
                .Move(points[0])
                .Curve(...mids, points[1])
            grayLine1.setPoints(points[0].x, points[0].y, points[2].x, points[2].y)
            grayLine2.setPoints(points[2].x, points[2].y, points[1].x, points[1].y)
            grayDots.forEach((dot, i) => dot.setCenter(ear.vector(points[i]).lerp(points[2], 0.5)))
            grayLine3.setPoints([0, 1].map((i) => ear.vector(points[i]).lerp(points[2], 0.5)))
        }, true)

    svg.play = (event) => {
        if (!controls) {
            return
        }
        const phase = Math.sin(event.time) * 0.5 + 0.5
        const vecs = controls.map((el) => ear.vector(el))
        const ctrl = [vecs[0].lerp(vecs[2], phase), vecs[2].lerp(vecs[1], phase)]
        midPoints.forEach((p, i) => p.setCenter(ctrl[i].x, ctrl[i].y))
        const lerp = ctrl[0].lerp(ctrl[1], phase)
        lerpDot.setCenter(lerp.x, lerp.y)
        midLine.setPoints(ctrl[0].x, ctrl[0].y, ctrl[1].x, ctrl[1].y)
        if (callback) {
            callback({ t: phase })
        }
    }
})

ear.svg(document.querySelector("#origami-3"), (svg) => {
    const GRIDS = 8

    svg.size(-1.5, -1.5, 3, 3).strokeWidth(0.04)
    const gridLayer = svg.g().stroke("lightgray").setClass("stroke-pen-2")
    const p = svg.polyline().fill("none").stroke("red").setClass("stroke-red").strokeLinejoin("round").strokeWidth(0.1)
    const drawLayer = svg.g()

    // grid lines
    for (let i = -GRIDS; i <= GRIDS; i += 1) {
        gridLayer.line(i, -GRIDS, i, GRIDS)
        gridLayer.line(-GRIDS, i, GRIDS, i)
    }
    gridLayer.line(0, -GRIDS, 0, GRIDS).stroke("darkgray").setClass("stroke-pen-1")
    gridLayer.line(-GRIDS, 0, GRIDS, 0).stroke("darkgray").setClass("stroke-pen-1")

    const points = []
    let callback // Declare callback variable

    const update = (mouse) => {
        drawLayer.removeChildren()
        if (mouse.buttons) {
            drawLayer.circle(mouse.press, 0.2).fill("black").setClass("fill-pen-0")
        }
        if (typeof callback === "function") {
            callback(mouse)
        }
    }

    svg.onMove = (mouse) => {
        points.push(mouse)
        if (points.length > 30) {
            points.shift()
        }
        p.setPoints(points)
        update(mouse)
    }

    svg.onPress = (mouse) => update(mouse)
    svg.onRelease = (mouse) => update(mouse)
})

ear.svg(document.querySelector("#origami-4"), (svg) => {
    const COUNT = 10
    const graph = {}
    let vertex_map = []
    const speeds = Array.from(Array(COUNT)).map(() => [0, 1].map(() => Math.random()))
    const offsets = Array.from(Array(COUNT)).map(() => [0, 1].map(() => Math.random() * Math.PI * 2))

    let timer = undefined

    svg.size(-0.1, -0.1, 1.2, 1.2)
    svg.style(`@keyframes dup-vertices-spark-frames {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(7); }
}
.dup-vertices-spark {
  animation: dup-vertices-spark-frames 0.3s ease-out normal forwards;
}
`)

    svg.size(1, 1).strokeWidth(0.015)

    const graphLayer = svg.g()
    const animLayer = svg.g()

    const resetGraph = () => {
        if (timer !== undefined) {
            clearTimeout(timer)
            timer = undefined
        }
        animLayer.removeChildren()
        Object.keys(graph).forEach((key) => delete graph[key])
        graph.vertices_coords = Array.from(Array(COUNT)).map(() => [0, 1].map(() => Math.random()))
        graph.edges_vertices = Array.from(Array(12)).map(() =>
            [Math.random(), Math.random()].map((n) => Number.parseInt(n * graph.vertices_coords.length)),
        )
        vertex_map = graph.vertices_coords.map((_, i) => i)

        ear.graph.clean(graph)
        const isolated = ear.graph.getIsolatedVertices(graph)
        ear.graph.remove(graph, "vertices", isolated)
    }

    resetGraph()

    const draw = () => {
        graphLayer.removeChildren()
        const drawing = graphLayer.origami(graph, false)
        drawing.vertices
            .stroke("black")
            .fill("white")
            .setClass("stroke-pen-0 fill-background")
            .childNodes.forEach((vert) => vert.setRadius(0.02))
        drawing.edges.stroke("black").setClass("stroke-pen-0")
    }

    draw()

    const animUpdate = () => {
        const result = ear.graph.removeDuplicateVertices(graph, 0.02)
        if (result.remove.length) {
            if (graph.vertices_coords.length < 5 && timer === undefined) {
                timer = setTimeout(resetGraph, 5000)
            }
            if (graph.vertices_coords.length < 4) {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(resetGraph, 1000)
            }
            result.remove.sort((a, b) => b - a).forEach((i) => vertex_map.splice(i, 1))
            const new_verts = result.remove.map((i) => result.map[i])
            const coord = graph.vertices_coords[new_verts[0]]
            const circle = animLayer
                .circle(...coord, 0.015)
                .fill("black")
                .setClass("dup-vertices-spark fill-pen-0")
            circle.setAttribute("transform-origin", `${coord[0]}px ${coord[1]}px`)
        }
    }

    let t = 0

    svg.play = (e) => {
        animUpdate()
        t += 1
        for (let i = 0; i < graph.vertices_coords.length; i += 1) {
            const j = vertex_map[i]
            if (!speeds[j]) {
                return
            }
            graph.vertices_coords[i][0] = 0.5 + 0.4 * Math.cos(t * speeds[j][0] * 0.05 + offsets[j][0])
            graph.vertices_coords[i][1] = 0.5 + 0.4 * Math.sin(t * speeds[j][1] * 0.05 + offsets[j][1])
        }
        draw()
    }

    svg.onPress = (e) => {
        resetGraph()
    }
})

ear.svg(document.querySelector("#origami-5"), (svg) => {
    svg
        .size(1, 1)
        .padding(0.05)
        .strokeWidth(1 / 100)

    const graph = ear.cp.square()

    let mouse = ear.vector(0.5, 0.5)
    let angle = 0.1

    const redraw = (graph) => {
        svg.removeChildren()
        svg.origami(graph)
        // draw exploded faces, shrink to make them more visible
        const exploded = ear.graph.explodeFaces(graph)
        exploded.vertices_coords = exploded.faces_vertices.flatMap((face) => {
            const verts = face.map((v) => exploded.vertices_coords[v])
            const center = ear.math.centroid(verts)
            return verts.map((v) => ear.math.lerp(v, center, 0.5))
        })
        ear.graph.svg.faces(exploded).appendTo(svg).fill("gold").setClass("fill-gold")
    }

    const splitGraph = (graph, face, origin) => {
        const line = ear.line.fromAngle(angle).translate(origin)
        const result = ear.graph.splitFace(graph, face, line.vector, line.origin)
        redraw(graph)
        return result
    }

    svg.onPress = (event) => {
        const face = ear.graph.nearestFace(graph, event.position)
        if (face === undefined) {
            return
        }
        const res = splitGraph(graph, face, event)
        if (res) {
            const edge = res.edges.new
            graph.edges_assignment[edge] = Math.random() < 0.5 ? "M" : "V"
        }
    }

    svg.onMove = (event) => {
        mouse = event.position
    }

    svg.play = (event) => {
        angle += 0.05
        const face = ear.graph.nearestFace(graph, mouse)
        if (face === undefined) {
            redraw(graph)
            return
        }
        splitGraph(JSON.parse(JSON.stringify(graph)), face, mouse)
    }

    redraw(graph)
})

ear.svg(document.querySelector("#origami-6"), (svg) => {
    svg
        .size(1, 1)
        .padding(0.1)
        .strokeWidth(1 / 100)

    // start with an unfolded square
    let origami = ear.origami()

    // make an initial crease
    const startAngle = 2 + Math.random() // radians
    const startCrease = ear.line.fromAngle(startAngle).translate(0.25, 0.25)
    origami.flatFold(startCrease)

    // every frame of onMove we fold the cache, not
    // the folded origami from the previous frame.
    let cache = origami.copy()

    svg.origami(origami.folded())

    svg.onPress = () => {
        cache = origami.copy()
    }
    svg.onRelease = () => {
        cache = origami.copy()
    }
    svg.onMove = (mouse) => {
        if (mouse.buttons === 0) {
            return
        }
        const crease = ear.axiom(2, { points: [mouse.press, mouse.position] }).shift()
        origami = cache.copy()
        origami.flatFold(crease)
        svg.removeChildren()
        svg.origami(origami.folded())
    }
})

ear.svg(document.querySelector("#canvas-origami-vertex"), (svg) => {
    svg.size(2.5, 1).padding(0.1).strokeWidth(0.01)

    const style = {
        edges: {
            valley: { "stroke-dasharray": "0.025 0.015" },
        },
    }

    // starting from a blank square,
    // make 3 creases from the center to 3 corners.
    // the fourth will be calculated using Kawasaki's theorem.
    const base = ear.cp.square()
    base.segment([0.5, 0.5], [0, 0])
    base.segment([0.5, 0.5], [1, 0])
    base.segment([0.5, 0.5], [1, 1])

    // get the indices of the center vertex
    const vertex = base.nearest(0.5, 0.5).vertex

    const update = (point) => {
        // to prevent confusion, clicking on folded form won't do anything.
        if (point.x > 1) {
            return
        }
        // make sure point is inside the unit square.
        point = {
            x: Math.max(Math.min(point.x, 1 - 1e-6), 1e-6),
            y: Math.max(Math.min(point.y, 1 - 1e-6), 1e-6),
        }

        // clone the cp from the base (3 creases)
        // set the center vertex to the point from the touch handler.
        const cp = base.copy()
        cp.vertices_coords[vertex] = [point.x, point.y]

        // using the angles between the 3 existing crease, this
        // will generate a fourth crease that satisfies Kawasaki.
        const solution = ear.singleVertex.kawasakiSolutions(cp, vertex)
        if (!solution) {
            return
        }
        cp.ray(solution, cp.vertices_coords[vertex])

        // fold the crease pattern
        const folded = cp.flatFolded()

        // solve layer order
        const faces_layer = ear.layer.solver(folded).facesLayer(2)
        cp.edges_assignment = ear.layer.facesLayerToEdgesAssignments(folded, faces_layer)
        folded.faces_layer = faces_layer

        // draw things
        svg.removeChildren()
        svg.origami(cp, style).addClass("grayscale")
        svg.origami(folded, style).translate(1.2, 0)
    }

    svg.onPress = update

    svg.onMove = (event) => {
        if (event.buttons) {
            update(event.position)
        }
    }

    update(ear.vector(Math.random(), Math.random()).scale(0.2).add([0.4, 0.4]))
})

const origamiElements = document.getElementsByClassName("script-link")

for (let i = 0; i < origamiElements.length; i++) {
    origamiElements[i].addEventListener(
        "touchstart",
        (event) => {
            event.preventDefault()
        },
        { passive: false },
    )

    origamiElements[i].addEventListener(
        "touchmove",
        (event) => {
            event.preventDefault()
        },
        { passive: false },
    )
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    fetch('https://form-email-r8oy.onrender.com/ian.minami.02@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch {
                    return text;
                }
            });
        })
        .then(data => {
            // Handle the response data here
            const formMessage = document.getElementById('formMessage');
            if (typeof data === 'object') {
                formMessage.className = 'message message-success';
                formMessage.textContent = 'Message sent successfully!';
                document.getElementById('contactForm').reset(); // Reset the form
            } else {
                formMessage.className = 'message message-success';
                formMessage.textContent = 'Message sent successfully!';
                document.getElementById('contactForm').reset(); // Reset the form
            }
            formMessage.style.display = 'block';
        })
        .catch((error) => {
            const formMessage = document.getElementById('formMessage');
            formMessage.className = 'message message-error';
            formMessage.textContent = 'An error occurred while sending the message.';
            formMessage.style.display = 'block';
            console.error('Error:', error);
        });
});