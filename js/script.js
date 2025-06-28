document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                whatsapp: document.getElementById('whatsapp').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Send data to Neon PostgreSQL
            saveContactToNeon(formData);
        });
    }
    
    // Function to save contact to Neon PostgreSQL
   async function saveContactToNeon(formData) {
    const formMessage = document.getElementById('formMessage');
    
    try {
        // Mostrar loading
        formMessage.textContent = 'Enviando mensagem...';
        formMessage.className = 'form-message';
        formMessage.style.display = 'block';

        const response = await fetch('https://sua-api.com/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }

        const data = await response.json();

        // Mostrar mensagem de sucesso
        formMessage.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
        formMessage.className = 'form-message success';
        
        // Resetar formulário
        document.getElementById('contactForm').reset();

    } catch (error) {
        console.error('Erro:', error);
        formMessage.textContent = 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.';
        formMessage.className = 'form-message error';
    } finally {
        // Esconder mensagem após 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}
}