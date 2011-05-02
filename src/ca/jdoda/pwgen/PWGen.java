package ca.jdoda.pwgen;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class PWGen extends Activity {
	private final int PASS_LENGTH = 12;
	private final int ROUNDS = 1000;
	
	private EditText passphraseEditText;
	private EditText confirmEditText;
	private EditText nicknameEditText;
	private EditText passwordEditText;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
		passphraseEditText = (EditText)findViewById(R.id.passphraseEditText);
		confirmEditText = (EditText)findViewById(R.id.confirmEditText);
		nicknameEditText = (EditText)findViewById(R.id.nicknameEditText);
		passwordEditText = (EditText)findViewById(R.id.passwordEditText);	
        
		nicknameEditText.setOnEditorActionListener(nicknameActionListener);
		
		Button generateButton = (Button)findViewById(R.id.generateButton);
        generateButton.setOnClickListener(generateClickListener);

        Button clearButton = (Button)findViewById(R.id.clearButton);
        clearButton.setOnClickListener(clearClickListener);
    }
    
    private OnClickListener generateClickListener = new OnClickListener() {
    	
		@Override
		public void onClick(View v) {
			String passphrase = passphraseEditText.getText().toString();
			String confirm = confirmEditText.getText().toString();
			String nickname = nicknameEditText.getText().toString();
			
			if (passphrase.equals(confirm)) {
				try {
					byte[] hash = (passphrase + nickname).getBytes("UTF-8");
					MessageDigest digester = MessageDigest.getInstance("SHA256");
					for (int i = 0; i < ROUNDS; i++) {
						hash = digester.digest(hash);
					}
					String password = Base64.encodeBytes(hash, Base64.URL_SAFE);
					passwordEditText.setText(password.subSequence(0, PASS_LENGTH));
				} catch (NoSuchAlgorithmException e) {
					passwordEditText.setText("Crap");
				} catch (UnsupportedEncodingException e) {
					passwordEditText.setText("Double Crap");
				} catch (IOException e) {
					passwordEditText.setText("Triple Crap");
				}	
			} else {
				passwordEditText.setText("Passwords don't match");
			}
		}
    };
    
    private OnClickListener clearClickListener = new OnClickListener() {
		
		@Override
		public void onClick(View v) {
			passphraseEditText.getText().clear();
			confirmEditText.getText().clear();
			nicknameEditText.getText().clear();
			passwordEditText.getText().clear();
		}
	};
    
    private OnEditorActionListener nicknameActionListener = new OnEditorActionListener() {
    	
		@Override
		public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
	        Button generateButton = (Button)findViewById(R.id.generateButton);
	        generateButton.performClick();
			return true;
		}
    };
}