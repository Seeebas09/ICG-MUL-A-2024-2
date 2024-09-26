import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;
import java.util.ArrayList;
import java.util.List;

public class SVGVectorizado extends JPanel {
    private List<Figura> figuras;

    public SVGVectorizado() {
        figuras = new ArrayList<>();
        initFiguras();
    }

    private void initFiguras() {
        Punto puntoInicio = new Punto(50, 50);
        Punto puntoFin = new Punto(200, 200);
        figuras.add(new Linea(puntoInicio, puntoFin));

        Punto centroCircunferencia = new Punto(300, 100);
        figuras.add(new Circunferencia(centroCircunferencia, 50));

        Punto centroElipse = new Punto(400, 300);
        figuras.add(new Elipse(centroElipse, 80, 50));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        for (Figura figura : figuras) {
            figura.dibujar(g2d);
        }
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("SVG Vectorizado - Funciones Primitivas");
        SVGVectorizado panel = new SVGVectorizado();
        frame.add(panel);
        frame.setSize(600, 400);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
}

abstract class Figura {
    abstract void dibujar(Graphics2D g2d);
}

class Punto {
    private int x;
    private int y;

    public Punto(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}

class Linea extends Figura {
    private Punto puntoInicio;
    private Punto puntoFin;

    public Linea(Punto puntoInicio, Punto puntoFin) {
        this.puntoInicio = puntoInicio;
        this.puntoFin = puntoFin;
    }

    @Override
    void dibujar(Graphics2D g2d) {
        g2d.setColor(Color.BLACK);
        g2d.setStroke(new BasicStroke(2));
        g2d.drawLine(puntoInicio.getX(), puntoInicio.getY(), puntoFin.getX(), puntoFin.getY());
    }
}

class Circunferencia extends Figura {
    private Punto centro;
    private int radio;

    public Circunferencia(Punto centro, int radio) {
        this.centro = centro;
        this.radio = radio;
    }

    @Override
    void dibujar(Graphics2D g2d) {
        g2d.setColor(Color.BLACK);
        g2d.setStroke(new BasicStroke(2));
        g2d.drawOval(centro.getX() - radio, centro.getY() - radio, radio * 2, radio * 2);
    }
}

class Elipse extends Figura {
    private Punto centro;
    private int rx;
    private int ry;

    public Elipse(Punto centro, int rx, int ry) {
        this.centro = centro;
        this.rx = rx;
        this.ry = ry;
    }

    @Override
    void dibujar(Graphics2D g2d) {
        g2d.setColor(Color.BLACK);
        g2d.setStroke(new BasicStroke(2));
        g2d.drawOval(centro.getX() - rx, centro.getY() - ry, rx * 2, ry * 2);
    }
}
