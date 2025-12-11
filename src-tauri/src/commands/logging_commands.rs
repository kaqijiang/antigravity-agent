/// 日志和加密命令
/// 负责日志管理、文件写入、数据加密解密等功能

use std::fs;
use std::path::Path;


/// 写入文本文件
/// 将文本内容写入指定路径的文件
#[tauri::command]
pub async fn write_text_file(path: String, content: String) -> Result<String, String> {
    crate::log_async_command!("write_text_file", async {
        let file_path = Path::new(&path);

        // 确保父目录存在
        if let Some(parent) = file_path.parent() {
            fs::create_dir_all(parent).map_err(|e| format!("创建目录失败: {}", e))?;
        }

        // 写入文件
        fs::write(file_path, content)
            .map_err(|e| format!("写入文件失败: {}", e))?;

        Ok(format!("文件写入成功: {}", path))
    })
}

/// 加密配置数据（使用 XOR 算法）
/// 将配置数据使用密码进行异或加密
#[tauri::command]
pub async fn encrypt_config_data(json_data: String, password: String) -> Result<String, String> {
    crate::log_async_command!("encrypt_config_data", async {
        use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};

        if password.is_empty() {
            return Err("密码不能为空".to_string());
        }

        let password_bytes = password.as_bytes();
        let mut result = Vec::new();

        // XOR 加密
        for (i, byte) in json_data.as_bytes().iter().enumerate() {
            let key_byte = password_bytes[i % password_bytes.len()];
            result.push(byte ^ key_byte);
        }

        // Base64 编码
        let encoded = BASE64.encode(&result);

        Ok(encoded)
    })
}

/// 解密配置数据（使用 XOR 算法）
/// 将加密的配置数据使用密码进行解密
#[tauri::command]
pub async fn decrypt_config_data(encrypted_data: String, password: String) -> Result<String, String> {
  crate::log_async_command!("decrypt_config_data", async {
        use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};

        if password.is_empty() {
            return Err("密码不能为空".to_string());
        }

        // Base64 解码
        let decoded = BASE64
            .decode(encrypted_data)
            .map_err(|_| "Base64 解码失败".to_string())?;

        let password_bytes = password.as_bytes();
        let mut result = Vec::new();

        // XOR 解密
        for (i, byte) in decoded.iter().enumerate() {
            let key_byte = password_bytes[i % password_bytes.len()];
            result.push(byte ^ key_byte);
        }

        // 转换为字符串
        let decrypted = String::from_utf8(result)
            .map_err(|_| "解密失败，数据可能已损坏".to_string())?;

        Ok(decrypted)
    })
}

/// 写入前端日志
/// 将前端日志条目写入到后端日志系统
#[tauri::command]
pub async fn write_frontend_log(logEntry: serde_json::Value) -> Result<(), String> {
  use tracing::{error, info, warn, debug};

  // 解析日志级别
  let level = logEntry.get("level")
    .and_then(|v| v.as_str())
    .unwrap_or("info");

  // 解析消息
  let message = logEntry.get("message")
    .and_then(|v| v.as_str())
    .unwrap_or("");

  // 解析模块名
  let module = logEntry.get("module")
    .and_then(|v| v.as_str())
    .unwrap_or("frontend");

  // 解析额外的数据
  let extra_data = logEntry.get("data");

  // 构建完整的日志消息
  let full_message = if let Some(data) = extra_data {
    format!("[{}] {}", module, data)
  } else {
    format!("[{}] {}", module, message)
  };

  // 根据级别输出日志 'info' | 'warn' | 'error' | 'debug'
    match level {
      "error" => error!(
            target = format!("frontend::{}", module),
            "{}",
            full_message
        ),
      "warn" => warn!(
            target = format!("frontend::{}", module),
            "{}",
            full_message
        ),
      "debug" => debug!(
            target = format!("frontend::{}", module),
            "{}",
            full_message
        ),
      _ => info!(
            target = format!("frontend::{}", module),
            "{}",
            full_message
        ),
    }

    Ok(())
}
