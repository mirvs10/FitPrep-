import java.sql.*;
public class CheckPlatos {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/Fitprep";
        try (Connection conn = DriverManager.getConnection(url, "postgres", "root");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT id, negocio_id, nombre FROM plato")) {
            while (rs.next()) {
                System.out.println(rs.getInt("id") + " | " + rs.getInt("negocio_id") + " | " + rs.getString("nombre"));
            }
        } catch (Exception e) { e.printStackTrace(); }
    }
}
