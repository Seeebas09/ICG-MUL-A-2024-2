import javax.swing.*;
import java.awt.*;

public class DibujarFiguras extends JPanel {

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setColor(Color.BLACK);

        // Dibujar la línea
        dibujarLinea(g, 50, 50, 200, 200);

        // Dibujar la circunferencia
        dibujarCircunferencia(g, 300, 100, 50);

        // Dibujar la elipse
        dibujarElipse(g, 400, 300, 80, 50);
    }

    // Algoritmo de Bresenham para dibujar una línea
    private void dibujarLinea(Graphics g, int x1, int y1, int x2, int y2) {
        int dx = Math.abs(x2 - x1);
        int dy = Math.abs(y2 - y1);
        int sx = (x1 < x2) ? 1 : -1;
        int sy = (y1 < y2) ? 1 : -1;
        int err = dx - dy;

        while (true) {
            g.drawRect(x1, y1, 1, 1); // Dibuja un "punto"
            if (x1 == x2 && y1 == y2) break;
            int e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }

    // Algoritmo de Bresenham para dibujar una circunferencia
    private void dibujarCircunferencia(Graphics g, int cx, int cy, int r) {
        int x = r;
        int y = 0;
        int err = 0;

        while (x >= y) {
            g.drawRect(cx + x, cy + y, 1, 1);
            g.drawRect(cx + y, cy + x, 1, 1);
            g.drawRect(cx - y, cy + x, 1, 1);
            g.drawRect(cx - x, cy + y, 1, 1);
            g.drawRect(cx - x, cy - y, 1, 1);
            g.drawRect(cx - y, cy - x, 1, 1);
            g.drawRect(cx + y, cy - x, 1, 1);
            g.drawRect(cx + x, cy - y, 1, 1);

            y++;
            if (err <= 0) {
                err += 2 * y + 1;
            }
            if (err > 0) {
                x--;
                err -= 2 * x + 1;
            }
        }
    }

    // Algoritmo para dibujar una elipse
    private void dibujarElipse(Graphics g, int cx, int cy, int a, int b) {
        int x = 0;
        int y = b;
        double a2 = Math.pow(a, 2);
        double b2 = Math.pow(b, 2);
        double err = b2 - (a2 * b) + (0.25 * a2);

        while (x <= a) {
            g.drawRect(cx + x, cy - (int)(b * Math.sqrt(1 - (x * x) / a2)), 1, 1);
            g.drawRect(cx - x, cy - (int)(b * Math.sqrt(1 - (x * x) / a2)), 1, 1);
            g.drawRect(cx + x, cy + (int)(b * Math.sqrt(1 - (x * x) / a2)), 1, 1);
            g.drawRect(cx - x, cy + (int)(b * Math.sqrt(1 - (x * x) / a2)), 1, 1);

            x++;
            err += b2 * (2 * x + 1);
            if (err >= 0) {
                y--;
                err -= a2 * (2 * y + 1);
            }
        }
    }

    // Método principal para lanzar la ventana
    public static void main(String[] args) {
        JFrame frame = new JFrame("Dibujar Figuras");
        DibujarFiguras panel = new DibujarFiguras();
        frame.add(panel);
        frame.setSize(600, 400);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
}
