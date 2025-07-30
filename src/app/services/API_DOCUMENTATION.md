# Documentation API Contact

## Configuration de l'API

### 1. URL de l'API

Dans le fichier `src/app/services/contact.service.ts`, remplacez l'URL par votre endpoint réel :

```typescript
private apiUrl = 'https://your-api-endpoint.com/contact';
```

### 2. Utilisation avec une vraie API

Dans `src/app/home/home.component.ts`, ligne 211, remplacez :
```typescript
this.contactService.submitContactFormMock(formData).subscribe({
```

Par :
```typescript
this.contactService.submitContactForm(formData).subscribe({
```

## Format des données envoyées

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+33 1 23 45 67 89",
  "service": "hajj-umrah",
  "message": "Je souhaite des informations sur vos services de pèlerinage.",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "AIS Travel Website"
}
```

## Format de réponse attendu

### Succès
```json
{
  "success": true,
  "message": "Message reçu avec succès",
  "id": "contact_12345"
}
```

### Erreur
```json
{
  "success": false,
  "message": "Erreur lors du traitement",
  "error": "Description de l'erreur"
}
```

## Headers HTTP

L'application envoie automatiquement ces headers :
- `Content-Type: application/json`
- `Accept: application/json`

## Services de contact populaires

### 1. EmailJS
```typescript
// Installation : npm install emailjs-com
import emailjs from 'emailjs-com';

submitWithEmailJS(formData: ContactFormData) {
  return emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    formData,
    'YOUR_USER_ID'
  );
}
```

### 2. Formspree
```typescript
private apiUrl = 'https://formspree.io/f/YOUR_FORM_ID';
```

### 3. Netlify Forms
```typescript
private apiUrl = '/_netlify/forms/contact';
```

## Exemple d'API Node.js/Express

```javascript
app.post('/contact', (req, res) => {
  const { firstName, lastName, email, phone, service, message } = req.body;
  
  // Validation
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Champs requis manquants'
    });
  }
  
  // Traitement (envoi email, sauvegarde DB, etc.)
  // ...
  
  res.json({
    success: true,
    message: 'Message reçu avec succès',
    id: `contact_${Date.now()}`
  });
});
```

## Sécurité

- Validez toujours les données côté serveur
- Utilisez HTTPS pour toutes les communications
- Implémentez un rate limiting
- Ajoutez un CAPTCHA si nécessaire
- Sanitisez les données pour éviter les injections

## Test

L'application utilise actuellement `submitContactFormMock()` qui simule un appel API avec un délai de 1.5 secondes pour tester l'interface utilisateur.