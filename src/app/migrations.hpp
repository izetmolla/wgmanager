class Migrations
{
public:
    static void migrate()
    {

        database.migrate("users", utils::dbColumnItem({{"email", "TEXT NOT NULL", ""}, {"fullname", "TEXT NOT NULL", ""}, {"username", "TEXT NOT NULL", ""}, {"status", "int default 1", ""}, {"password", "TEXT NOT NULL", ""}}));
        database.migrate("refresh_tokens", utils::dbColumnItem({{"token", "TEXT NOT NULL"}, {"user_id", "int NOT NULL"}, {"expired", "INT DEFAULT 0"}}));
        database.migrate("roles", utils::dbColumnItem({{"role", "TEXT NOT NULL"}, {"user_id", "int NOT NULL"}}));
        database.migrate("options", utils::dbColumnItem({{"name", "TEXT NOT NULL"}, {"option", "TEXT", "''"}}), {false, false});
        database.migrate("clients", utils::dbColumnItem({{"user_id", "int NOT NULL"}, {"name", "TEXT", "''"}, {"public_key", "TEXT", "''"}, {"private_key", "TEXT", "''"}, {"preshared_key", "TEXT", "''"}, {"lastHandshakeTime", "INT", "0"}, {"tRx", "INT", "0"}, {"transferRx", "INT", "0"}, {"tTx", "INT", "0"}, {"transferTx", "INT", "0"}}), {false, false});
        database.migrate("ip_addresses", utils::dbColumnItem({{"client_id", "INT", "0"}, {"type", "INT", "0"}, {"status", "INT", "1"}, {"ip", "TEXT", "''"}, {"octet0", "TEXT", "''"}, {"octet1", "TEXT", "''"}, {"octet2", "TEXT", "''"}, {"octet3", "TEXT", "''"}, {"cidr", "TEXT", "''"}}));
        database.migrate("session_tokens", utils::dbColumnItem({{"token", "TEXT NOT NULL"}, {"user_id", "int NOT NULL"}, {"object_id", "TEXT DEFAULT 1"}}));

        // // Relations
        // database.query("ALTER TABLE roles ADD CONSTRAINT fk_roles_user_id FOREIGN KEY (user_id) REFERENCES users (id)");
        // database.query("ALTER TABLE clients ADD CONSTRAINT fk_clients_user_id FOREIGN KEY (user_id) REFERENCES users (id)");
        // database.query("ALTER TABLE ip_addresses ADD CONSTRAINT fk_ipaddresses_client_id FOREIGN KEY (client_id) REFERENCES clients (id)");

        // Insert Records

        if (database.select_record<User>("users", {{"username", "=", "admin"}}, {"id"}).id == 0)
        {
            int user_id = database.insert_record("users", {{"email", "admin@spazfeed.com"}, {"password", utils::createMd5Hash("admin")}, {"username", "admin"}, {"fullname", "Administrator"}, {"status", "1"}, {"created_at", utils::now()}, {"updated_at", utils::now()}});
            database.insert_record("roles", {{"user_id", std::to_string(user_id)}, {"role", "admin"}, {"created_at", utils::now()}});
        }
    }
};