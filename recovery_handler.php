<?php
header('Content-Type: application/json');

// Configuration de base de données
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'bebol';

// Connexion BD
try {
    $conn = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_USER, $DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Erreur de connexion BD']));
}

$action = $_POST['action'] ?? '';

switch($action) {
    case 'send_code':
        sendVerificationCode($conn);
        break;
    case 'verify_code':
        verifyCode($conn);
        break;
    case 'reset_password':
        resetPassword($conn);
        break;
    default:
        http_response_code(400);
        die(json_encode(['success' => false, 'message' => 'Action invalide']));
}

function sendVerificationCode($conn) {
    $email = $_POST['email'] ?? '';
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email invalide']);
        return;
    }
    
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Email non trouvé']);
        return;
    }
    
    $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $token = bin2hex(random_bytes(32));
    $expireTime = date('Y-m-d H:i:s', strtotime('+15 minutes'));
    
    $stmt = $conn->prepare("DELETE FROM recovery_codes WHERE email = ?");
    $stmt->execute([$email]);
    
    $stmt = $conn->prepare("INSERT INTO recovery_codes (email, code, token, expires_at) VALUES (?, ?, ?, ?)");
    $stmt->execute([$email, $code, $token, $expireTime]);
    
    $subject = "Code de vérification BEBOL";
    $message = "Votre code de vérification est: " . $code . "\n";
    $message .= "Ce code expire dans 15 minutes.\n";
    $message .= "Ne partagez pas ce code avec quiconque.";
    
    $headers = "From: noreply@bebol.com\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    if (mail($email, $subject, $message, $headers)) {
        echo json_encode([
            'success' => true,
            'message' => 'Code envoyé avec succès',
            'token' => $token
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi de l\'email']);
    }
}

function verifyCode($conn) {
    $token = $_POST['token'] ?? '';
    $code = $_POST['code'] ?? '';
    
    if (!$token || !$code || strlen($code) !== 6) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Paramètres invalides']);
        return;
    }
    
    $stmt = $conn->prepare("SELECT email FROM recovery_codes WHERE token = ? AND code = ? AND expires_at > NOW()");
    $stmt->execute([$token, $code]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Code invalide ou expiré']);
        return;
    }
    
    $verificationToken = bin2hex(random_bytes(32));
    $row = $stmt->fetch();
    $email = $row['email'];
    
    $stmt = $conn->prepare("UPDATE recovery_codes SET token = ? WHERE email = ?");
    $stmt->execute([$verificationToken, $email]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Code vérifié',
        'verification_token' => $verificationToken
    ]);
}

function resetPassword($conn) {
    $verificationToken = $_POST['verification_token'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (!$verificationToken || !$password || strlen($password) < 8) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Paramètres invalides']);
        return;
    }
    
    $stmt = $conn->prepare("SELECT email FROM recovery_codes WHERE token = ?");
    $stmt->execute([$verificationToken]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Token invalide']);
        return;
    }
    
    $row = $stmt->fetch();
    $email = $row['email'];
    
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->execute([$hashedPassword, $email]);
    
    $stmt = $conn->prepare("DELETE FROM recovery_codes WHERE email = ?");
    $stmt->execute([$email]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Mot de passe réinitialisé avec succès'
    ]);
}

$conn = null;
?>