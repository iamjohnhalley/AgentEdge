<?php
// Form Handler for AgentEdge Audit Requests
// This script processes form submissions and sends them to sarah@agentedge.ie

// Set content type for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get form data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
$required_fields = ['firstName', 'lastName', 'email', 'county', 'challenges'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input data
$firstName = htmlspecialchars($data['firstName']);
$lastName = htmlspecialchars($data['lastName']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars($data['phone'] ?? '');
$county = htmlspecialchars($data['county']);
$agencyName = htmlspecialchars($data['agencyName'] ?? '');
$website = htmlspecialchars($data['website'] ?? '');
$challenges = htmlspecialchars($data['challenges']);
$goals = htmlspecialchars($data['goals'] ?? '');

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Convert challenge code to readable text
function getChallengeText($challenge) {
    $challenges = [
        'no-website' => 'No website or outdated website',
        'no-leads' => 'Not getting enough leads',
        'social-media' => 'Poor social media presence',
        'google-visibility' => 'Not showing up on Google',
        'competition' => 'Losing business to competitors',
        'time' => 'No time for marketing'
    ];
    return $challenges[$challenge] ?? $challenge;
}

// Prepare email content
$to = 'sarah@agentedge.ie';
$subject = '🚀 New Audit Request from ' . $firstName . ' ' . $lastName;

$message = "
📋 NEW AUDIT REQUEST RECEIVED

👤 CONTACT INFORMATION:
Name: $firstName $lastName
Email: $email
Phone: $phone
County: " . ucfirst($county) . "

🏢 BUSINESS DETAILS:
Agency Name: " . ($agencyName ?: 'Not provided') . "
Current Website: " . ($website ?: 'None') . "

💡 CHALLENGES & GOALS:
Main Challenge: " . getChallengeText($challenges) . "
Success Goals: " . ($goals ?: 'Not specified') . "

📅 SUBMISSION DETAILS:
Date: " . date('Y-m-d H:i:s') . "
IP Address: " . $_SERVER['REMOTE_ADDR'] . "

---
Reply to this email to contact the lead directly.
";

// Email headers
$headers = "From: AgentEdge Form <noreply@agentedge.ie>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mail_sent = mail($to, $subject, $message, $headers);

if ($mail_sent) {
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Audit request submitted successfully'
    ]);
    
    // Log successful submission (optional)
    error_log("AgentEdge Form Submission: $firstName $lastName ($email) from $county");
} else {
    // Error response
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email. Please try again or contact sarah@agentedge.ie directly.'
    ]);
    
    // Log error
    error_log("AgentEdge Form Error: Failed to send email for $firstName $lastName ($email)");
}
?>
