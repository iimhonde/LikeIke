import React, { useState } from 'react';
import './Subdomain.css';
import './Token.css';
import iconImage from '../Icon/Icon.jpg';

// Tooltip components for subdomain and token
const SubTooltip = ({ text, visible }) => (
    visible ? (
        <div className="subdomain-tooltip">
            <div className="subdomain-help-text">{text}</div>
        </div>
    ) : null
);

const TokenTooltip = ({ text, visible }) => (
    visible ? (
        <div className="token-tooltip">
            <div className="token-help-text">{text}</div>
        </div>
    ) : null
);

const GenerateInputs = ({ setToken, setSubdomain }) => {
    const [showSubdomainTooltip, setShowSubdomainTooltip] = useState(false);
    const [showTokenTooltip, setShowTokenTooltip] = useState(false);

    return (
        <form>
            <div className="subdomain-input">
                <input
                    type="text"
                    placeholder="University/Institution"
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="subdomain-text"
                />
                <img
                    src={iconImage}
                    alt="Icon"
                    className="subdomain-tooltip-icon"
                    onMouseEnter={() => setShowSubdomainTooltip(true)}
                    onMouseLeave={() => setShowSubdomainTooltip(false)}
                />
                <SubTooltip 
                    text={"Input field for entering the institution’s Canvas subdomain.\n\n(e.g., 'ucf.instructure.com' => 'ucf', 'valenciacollege.instructure.com' => 'valenciacollege')"} 
                    visible={showSubdomainTooltip} 
                />
            </div>
            <br />
            <div className="token-input">
                <input
                    type="text"
                    placeholder="Token"
                    onChange={(e) => setToken(e.target.value)}
                    className="token-text"
                />
                <img
                    src={iconImage}
                    alt="Icon"
                    className="token-tooltip-icon"
                    onMouseEnter={() => setShowTokenTooltip(true)}
                    onMouseLeave={() => setShowTokenTooltip(false)}
                />
                <TokenTooltip
                    visible={showTokenTooltip}
                    text={
                        <>
                            <span>1. Login to your Canvas account.</span><br />
                            <span>2. Click on the "Account" icon on the left-hand side.</span><br />
                            <span>3. Select “Settings” in the dropdown menu within your account section.</span><br />
                            <span>4. Scroll down to “Approved Integrations”.</span><br />
                            <span>5. Click on “+ New Access Token”.</span><br />
                            <span>6. Generate the Token:</span><br />
                            <span style={{ paddingLeft: '1em' }}>- Optionally add a purpose for the token.</span><br />
                            <span style={{ paddingLeft: '1em' }}>- Set an expiration date if desired.</span><br />
                            <span style={{ paddingLeft: '1em' }}>- Click “Generate Token”.</span><br />
                            <span>7. Copy the Token immediately and save it somewhere safe</span><br />
                            <span style={{ paddingLeft: '1em' }}>- (you won’t be able to view it again).</span><br />
                            <span>8. Use the Token:</span><br />
                            <span style={{ paddingLeft: '1em' }}>- Paste it in the app’s access token field to sync Canvas data like assignments and grades with other tools or dashboards.</span>
                        </>
                    }
                />
            </div>
            <br />
        </form>
    );
};

export default GenerateInputs;
