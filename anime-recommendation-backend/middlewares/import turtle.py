import turtle

def draw_square(t, size):
    for _ in range(4):
        t.forward(size)
        t.left(90)

def draw_rectangle(t, width, height):
    for _ in range(2):
        t.forward(width)
        t.left(90)
        t.forward(height)
        t.left(90)

def draw_robot():
    screen = turtle.Screen()
    screen.bgcolor("white")

    t = turtle.Turtle()
    t.speed(2)

    # Draw head
    t.penup()
    t.goto(-50, 100)
    t.pendown()
    draw_square(t, 100)

    # Draw eyes
    t.penup()
    t.goto(-30, 150)
    t.pendown()
    t.dot(20)
    t.penup()
    t.goto(30, 150)
    t.pendown()
    t.dot(20)

    # Draw mouth
    t.penup()
    t.goto(-30, 120)
    t.pendown()
    t.forward(60)

    # Draw body
    t.penup()
    t.goto(-75, 100)
    t.pendown()
    draw_rectangle(t, 150, 200)

    # Draw arms
    t.penup()
    t.goto(-75, 50)
    t.pendown()
    t.forward(50)
    t.penup()
    t.goto(75, 50)
    t.pendown()
    t.forward(50)

    # Draw legs
    t.penup()
    t.goto(-50, -100)
    t.pendown()
    draw_rectangle(t, 50, 100)
    t.penup()
    t.goto(0, -100)
    t.pendown()
    draw_rectangle(t, 50, 100)

    t.hideturtle()
    screen.mainloop()

draw_robot()
