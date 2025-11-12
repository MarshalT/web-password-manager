#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTTPS 本地服务器 - 支持局域网访问
用于密码管理器应用，支持 Web Crypto API
"""

import http.server
import ssl
import socket
import os
import sys
from pathlib import Path

def get_local_ip():
    """获取本机局域网IP地址"""
    try:
        # 创建一个UDP socket连接来获取本地IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def generate_self_signed_cert():
    """生成自签名证书"""
    try:
        from OpenSSL import crypto
        
        # 创建密钥对
        key = crypto.PKey()
        key.generate_key(crypto.TYPE_RSA, 2048)
        
        # 创建自签名证书
        cert = crypto.X509()
        cert.get_subject().CN = get_local_ip()
        cert.set_serial_number(1000)
        cert.gmtime_adj_notBefore(0)
        cert.gmtime_adj_notAfter(365*24*60*60)  # 1年有效期
        cert.set_issuer(cert.get_subject())
        cert.set_pubkey(key)
        cert.sign(key, 'sha256')
        
        # 保存证书和密钥
        with open("server.crt", "wb") as f:
            f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
        with open("server.key", "wb") as f:
            f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, key))
            
        print("✓ 已生成自签名证书")
        return True
    except ImportError:
        print("⚠ 未安装 pyOpenSSL，使用简化方法...")
        # 使用 openssl 命令行工具
        import subprocess
        try:
            local_ip = get_local_ip()
            subprocess.run([
                'openssl', 'req', '-x509', '-newkey', 'rsa:2048',
                '-keyout', 'server.key', '-out', 'server.crt',
                '-days', '365', '-nodes',
                '-subj', f'/CN={local_ip}'
            ], check=True, capture_output=True)
            print("✓ 已生成自签名证书")
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("✗ 无法生成证书，请手动安装 openssl 或 pyOpenSSL")
            return False

def start_https_server(port=8443):
    """启动 HTTPS 服务器"""
    
    # 检查证书文件
    if not (os.path.exists("server.crt") and os.path.exists("server.key")):
        print("未找到证书文件，正在生成...")
        if not generate_self_signed_cert():
            print("\n无法生成证书，请安装以下工具之一：")
            print("1. pip install pyOpenSSL")
            print("2. 或安装 openssl 命令行工具")
            return
    
    # 获取本机IP
    local_ip = get_local_ip()
    
    # 创建 HTTP 服务器
    Handler = http.server.SimpleHTTPRequestHandler
    httpd = http.server.HTTPServer(('0.0.0.0', port), Handler)
    
    # 配置 SSL
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('server.crt', 'server.key')
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    
    print("=" * 60)
    print("   链上密码本管理器 - HTTPS 服务器")
    print("=" * 60)
    print()
    print(f"✓ 服务器已启动")
    print()
    print("📱 访问地址:")
    print(f"   本机访问: https://localhost:{port}/index.html")
    print(f"   局域网访问: https://{local_ip}:{port}/index.html")
    print()
    print("⚠️  重要提示:")
    print("   1. 浏览器会提示证书不安全，这是正常的")
    print("   2. 点击 '高级' -> '继续访问' 即可")
    print("   3. 移动端同样需要接受证书警告")
    print()
    print("📱 移动端访问步骤:")
    print(f"   1. 确保手机和电脑在同一WiFi")
    print(f"   2. 手机浏览器访问: https://{local_ip}:{port}/index.html")
    print(f"   3. 接受证书警告")
    print()
    print("🔒 为什么需要 HTTPS:")
    print("   - Web Crypto API (加密功能) 需要 HTTPS")
    print("   - 钱包插件连接需要安全环境")
    print()
    print("按 Ctrl+C 停止服务器")
    print("=" * 60)
    print()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n服务器已停止")

if __name__ == '__main__':
    # 切换到脚本所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 检查端口参数
    port = 8443
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"无效的端口号: {sys.argv[1]}")
            sys.exit(1)
    
    start_https_server(port)

