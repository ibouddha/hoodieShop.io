document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const previewImage = document.querySelector('.hero-image');
    const cartButton = document.getElementById('cartButton');
    const mainAddToCartButton = document.getElementById('mainAddToCart');
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.innerHTML = ''; // Réinitialiser la galerie

    // Liste des images à charger dans la galerie
    const galleryImages = [
        'images/image2.png',
        'images/image3.png',
        'images/image4.png'
    ];

    // ✅ Charger seulement les images existantes
    galleryImages.forEach((imageSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
    
        const img = document.createElement('img');
        img.classList.add('gallery-image');
        img.src = imageSrc;
        img.alt = `Produit ${index + 1}`;
    
        // Si l'image charge bien, on l'ajoute
        img.onload = () => {
            galleryItem.appendChild(img);
            galleryContainer.appendChild(galleryItem);
        };
    
        // Si l'image est cassée, on ne l'affiche pas
        img.onerror = () => {
            console.warn(`❌ Image ignorée (non trouvée) : ${imageSrc}`);
        };
    });
    


    // ✅ Changement de l’image principale au clic
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-image')) {
            previewImage.src = e.target.src;
        }
    });

    // ✅ Effet 3D au survol
    document.addEventListener('mousemove', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / rect.height / 2) * -10;
            const rotateY = ((x - rect.width / 2) / rect.width / 2) * 10;
            item.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        }
    });

    // document.addEventListener('mouseleave', (e) => {
    //     if (e.target.classList.contains('gallery-item')) {
    //         e.target.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    //     }
    // });

    // ✅ Ajouter un produit au panier
    function addToCart(name, price, image) {
        const existing = cart.find(p => p.name === name && p.image === image);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }

        updateCartDisplay();
        showAddToCartNotification();
    }

    // ✅ Mettre à jour l'affichage du bouton panier
    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartButton.textContent = `Panier (${totalItems})`;
    }

    // ✅ Notification ajout panier
    function showAddToCartNotification() {
        const notification = document.createElement('div');
        notification.textContent = 'Produit ajouté au panier !';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;

        if (!document.querySelector('#notification-style')) {
            const style = document.createElement('style');
            style.id = 'notification-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // ✅ Afficher la modal du panier
    function showCartModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            font-family: 'Poppins', sans-serif;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        let cartHTML = '<h2 style="margin-top: 0; color: #1f3366;">Votre Panier</h2>';

        if (cart.length === 0) {
            cartHTML += '<p>Votre panier est vide.</p>';
        } else {
            let total = 0;
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                cartHTML += `
                    <div style="display: flex; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 1rem; border-radius: 5px;">
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0;">${item.name} x ${item.quantity}</h4>
                            <p style="margin: 0; color: #666;">${item.price.toFixed(2)}F CFA x ${item.quantity} = ${(itemTotal).toFixed(2)}F CFA</p>
                        </div>
                        <button onclick="removeFromCart(${index})" style="background-color: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Supprimer</button>
                    </div>
                `;
            });
            cartHTML += `<div style="text-align: right; font-weight: bold; font-size: 1.2rem; margin-top: 1rem;">Total: ${total.toFixed(2)}F CFA</div>`;
        }

        cartHTML += `
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="closeCartModal()" style="background-color: #1f3366; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Fermer</button>
                ${cart.length > 0 ? '<button style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Commander</button>' : ''}
            </div>
        `;

        modalContent.innerHTML = cartHTML;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Fonctions globales
        window.closeCartModal = () => modal.remove();
        window.removeFromCart = (index) => {
            cart.splice(index, 1);
            updateCartDisplay();
            modal.remove();
            showCartModal();
        };
    }

    // 🎯 Bouton principal
    mainAddToCartButton.addEventListener('click', () => {
        addToCart('Produit Principal', 20000, previewImage.src);
    });

    // 🎯 Ajout depuis la galerie (double clic)
    document.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('gallery-image')) {
            const name = e.target.alt || 'Produit';
            addToCart(name, 20000, e.target.src);
        }
    });

    // 🎯 Ouvrir le panier
    cartButton.addEventListener('click', showCartModal);
});


