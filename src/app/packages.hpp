#include "iostream"
#include <sqlite3.h>
#include "crow.h"
#include <CLI/Config.hpp>
#include <CLI/Formatter.hpp>
#include <openssl/sha.h>
#include <cstring>
#include <regex>
#include "jwt/jwt.hpp"
#include <chrono>


#include <nlohmann/json.hpp>
using json = nlohmann::json;

// Config
#include "config.hpp"
#include "utils.hpp"
using namespace utils;

// JWT
#include "jwt.hpp"

// CLI
#include "cli.hpp"

// Database
#include "database.hpp"
#include "model.hpp"

// Migrations
#include "migrations.hpp"

// Middleweares
#include "../middleweares/Authorization.hpp"

// Controllers
#include "../controllers/ClientController.hpp"
#include "../controllers/GeneralController.hpp"
#include "../controllers/AuthorizationController.hpp"
#include "../controllers/UserController.hpp"

// Routes
#include "../routes.hpp"