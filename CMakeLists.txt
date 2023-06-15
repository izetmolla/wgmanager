cmake_minimum_required(VERSION 3.22)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
project(wgmanager VERSION 1.0)
add_executable(wgmanager src/main.cpp)
set(CMAKE_PREFIX_PATH "/opt/vcpkg/installed/x64-linux/share")

file(COPY frontend/build/ DESTINATION ${CMAKE_BINARY_DIR}/public_html)
file(COPY .env DESTINATION ${CMAKE_BINARY_DIR})



# this is heuristically generated, and may not be correct
find_package(Crow CONFIG REQUIRED)
target_link_libraries(wgmanager PRIVATE Crow::Crow)

find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(wgmanager PRIVATE unofficial::sqlite3::sqlite3)

find_package(CLI11 CONFIG REQUIRED)
target_link_libraries(wgmanager PRIVATE CLI11::CLI11)

find_package(OpenSSL REQUIRED)
target_link_libraries(wgmanager PRIVATE OpenSSL::SSL OpenSSL::Crypto)

find_package(nlohmann_json CONFIG REQUIRED)
target_link_libraries(wgmanager PRIVATE nlohmann_json::nlohmann_json)

find_package(cpp-jwt CONFIG REQUIRED)
target_link_libraries(wgmanager PRIVATE cpp-jwt::cpp-jwt)